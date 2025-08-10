import { ErrorHandler } from '../middleware/ErrorHandler.js'

/**
 * Central bot management system with circuit breaker pattern
 * Based on microservices resilience patterns
 */
export class BotManager {
  constructor(options = {}) {
    this.bots = new Map()
    this.circuitBreakers = new Map()
    this.errorHandler = options.errorHandler || new ErrorHandler()
    this.config = {
      circuitBreakerThreshold: 5, // failures before opening circuit
      circuitBreakerTimeout: 60000, // 1 minute
      ...options.config
    }
  }

  /**
   * Register a bot with the manager
   */
  registerBot(botType, botClass, config = {}) {
    if (this.bots.has(botType)) {
      throw new Error(`Bot type '${botType}' is already registered`)
    }

    this.bots.set(botType, {
      class: botClass,
      config: { ...config, botType },
      instance: null,
      registered: new Date()
    })
    
    // Initialize circuit breaker for this bot
    this.circuitBreakers.set(botType, {
      failures: 0,
      lastFailure: null,
      lastSuccess: null,
      state: 'closed', // closed, open, half-open
      threshold: this.config.circuitBreakerThreshold,
      timeout: this.config.circuitBreakerTimeout
    })

    console.log(`Registered bot: ${botType}`)
  }

  /**
   * Execute a bot with circuit breaker protection
   */
  async executeBot(botType, input = {}) {
    if (!this.bots.has(botType)) {
      throw new Error(`Bot type '${botType}' is not registered`)
    }

    const circuitBreaker = this.circuitBreakers.get(botType)
    
    // Check circuit breaker state
    if (this.isCircuitOpen(circuitBreaker)) {
      const timeRemaining = Math.ceil((circuitBreaker.timeout - (Date.now() - circuitBreaker.lastFailure)) / 1000)
      throw new Error(`Bot ${botType} is temporarily disabled due to repeated failures. Retry in ${timeRemaining} seconds.`)
    }

    try {
      const bot = this.getBotInstance(botType)
      const result = await bot.execute(input)
      
      // Reset circuit breaker on success
      this.recordSuccess(botType)
      
      return result
      
    } catch (error) {
      // Record failure in circuit breaker
      this.recordFailure(botType)
      
      // Handle error through middleware
      const errorResponse = await this.errorHandler.handleError(error, {
        botType,
        input,
        circuitBreakerState: circuitBreaker.state,
        failureCount: circuitBreaker.failures
      })

      // Re-throw the error to maintain the error flow
      throw error
    }
  }

  /**
   * Get bot instance (lazy loading)
   */
  getBotInstance(botType) {
    const botInfo = this.bots.get(botType)
    
    if (!botInfo.instance) {
      try {
        botInfo.instance = new botInfo.class(botInfo.config)
      } catch (error) {
        throw new Error(`Failed to instantiate bot ${botType}: ${error.message}`)
      }
    }

    return botInfo.instance
  }

  /**
   * Check if circuit breaker is open
   */
  isCircuitOpen(circuitBreaker) {
    if (circuitBreaker.state === 'open') {
      const timeSinceLastFailure = Date.now() - circuitBreaker.lastFailure
      
      // Check if timeout period has passed
      if (timeSinceLastFailure > circuitBreaker.timeout) {
        circuitBreaker.state = 'half-open'
        console.log(`Circuit breaker moved to half-open state`)
        return false
      }
      
      return true
    }
    
    return false
  }

  /**
   * Record successful bot execution
   */
  recordSuccess(botType) {
    const circuitBreaker = this.circuitBreakers.get(botType)
    
    if (circuitBreaker.state === 'half-open') {
      // Success in half-open state closes the circuit
      circuitBreaker.state = 'closed'
      circuitBreaker.failures = 0
      console.log(`Circuit breaker for ${botType} closed after successful execution`)
    }
    
    circuitBreaker.lastSuccess = Date.now()
  }

  /**
   * Record failed bot execution
   */
  recordFailure(botType) {
    const circuitBreaker = this.circuitBreakers.get(botType)
    
    circuitBreaker.failures++
    circuitBreaker.lastFailure = Date.now()
    
    // Open circuit if threshold exceeded
    if (circuitBreaker.failures >= circuitBreaker.threshold && circuitBreaker.state === 'closed') {
      circuitBreaker.state = 'open'
      console.error(`Circuit breaker opened for ${botType} after ${circuitBreaker.failures} failures`)
    }
  }

  /**
   * Get bot health status
   */
  async getBotHealth(botType) {
    if (!this.bots.has(botType)) {
      return {
        botType,
        status: 'not_registered',
        timestamp: new Date().toISOString()
      }
    }

    try {
      const bot = this.getBotInstance(botType)
      const health = await bot.healthCheck()
      const circuitBreaker = this.circuitBreakers.get(botType)
      
      return {
        ...health,
        circuitBreaker: {
          state: circuitBreaker.state,
          failures: circuitBreaker.failures,
          lastFailure: circuitBreaker.lastFailure,
          lastSuccess: circuitBreaker.lastSuccess
        }
      }
    } catch (error) {
      return {
        botType,
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Get overall system health
   */
  async getSystemHealth() {
    const health = {
      timestamp: new Date().toISOString(),
      overall: 'healthy',
      bots: {},
      summary: {
        total: this.bots.size,
        healthy: 0,
        unhealthy: 0,
        disabled: 0
      }
    }

    // Check each registered bot
    for (const [botType] of this.bots) {
      try {
        const botHealth = await this.getBotHealth(botType)
        health.bots[botType] = botHealth
        
        if (botHealth.status === 'healthy') {
          health.summary.healthy++
        } else if (botHealth.circuitBreaker?.state === 'open') {
          health.summary.disabled++
        } else {
          health.summary.unhealthy++
        }
      } catch (error) {
        health.bots[botType] = {
          status: 'error',
          error: error.message
        }
        health.summary.unhealthy++
      }
    }

    // Determine overall health
    if (health.summary.unhealthy > 0 || health.summary.disabled > 0) {
      health.overall = health.summary.disabled === health.summary.total ? 'critical' : 'degraded'
    }

    return health
  }

  /**
   * Reset circuit breaker for a bot (admin function)
   */
  resetCircuitBreaker(botType) {
    if (!this.circuitBreakers.has(botType)) {
      throw new Error(`No circuit breaker found for bot type: ${botType}`)
    }

    const circuitBreaker = this.circuitBreakers.get(botType)
    circuitBreaker.state = 'closed'
    circuitBreaker.failures = 0
    circuitBreaker.lastFailure = null
    
    console.log(`Circuit breaker reset for bot: ${botType}`)
  }

  /**
   * Get list of registered bots
   */
  getRegisteredBots() {
    const bots = []
    
    for (const [botType, botInfo] of this.bots) {
      const circuitBreaker = this.circuitBreakers.get(botType)
      
      bots.push({
        botType,
        registered: botInfo.registered,
        circuitBreaker: {
          state: circuitBreaker.state,
          failures: circuitBreaker.failures
        },
        hasInstance: botInfo.instance !== null
      })
    }
    
    return bots
  }

  /**
   * Shutdown all bots gracefully
   */
  async shutdown() {
    console.log('Shutting down bot manager...')
    
    for (const [botType, botInfo] of this.bots) {
      if (botInfo.instance && typeof botInfo.instance.shutdown === 'function') {
        try {
          await botInfo.instance.shutdown()
        } catch (error) {
          console.error(`Error shutting down bot ${botType}:`, error.message)
        }
      }
    }
    
    console.log('Bot manager shutdown complete')
  }
}