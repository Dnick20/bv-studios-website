import { z } from 'zod'

/**
 * Abstract base class for all bots following clean architecture principles
 * Based on Microsoft Bot Framework patterns and dependency injection
 */
export class BaseBot {
  constructor(config, services = {}) {
    this.config = {
      botType: 'unknown',
      enableLogging: true,
      enableMetrics: true,
      dryRun: false,
      ...config
    }
    
    // Dependency injection for testing and flexibility
    this.validator = services.validator || this.createValidator()
    this.logger = services.logger || this.createLogger()
    this.metrics = services.metrics || this.createMetrics()
    
    // Execution tracking
    this.isRunning = false
    this.lastExecution = null
  }

  /**
   * Main execution method with comprehensive error handling and logging
   */
  async execute(input = {}) {
    if (this.isRunning) {
      throw new Error(`Bot ${this.config.botType} is already running`)
    }

    const startTime = Date.now()
    const executionId = this.generateExecutionId()
    
    this.isRunning = true
    
    try {
      // Validate input using bot-specific schema
      const validInput = await this.validateInput(input)
      
      // Log execution start
      await this.logInfo('Bot execution started', {
        executionId,
        botType: this.config.botType,
        input: validInput,
        dryRun: this.config.dryRun
      })

      // Execute bot-specific logic
      const result = await this.process(validInput, executionId)

      // Calculate execution duration
      const duration = Date.now() - startTime

      // Record success metrics
      if (this.config.enableMetrics) {
        await this.metrics.recordSuccess(duration, result)
      }

      // Log successful completion
      await this.logInfo('Bot execution completed successfully', {
        executionId,
        duration,
        resultSummary: this.summarizeResult(result)
      })

      this.lastExecution = {
        timestamp: new Date(),
        status: 'success',
        duration,
        executionId
      }

      return {
        success: true,
        executionId,
        data: result,
        duration,
        timestamp: new Date().toISOString()
      }

    } catch (error) {
      const duration = Date.now() - startTime
      
      // Record failure metrics
      if (this.config.enableMetrics) {
        await this.metrics.recordFailure(duration, error)
      }

      // Log error with context
      await this.logError('Bot execution failed', error, {
        executionId,
        duration,
        input
      })

      this.lastExecution = {
        timestamp: new Date(),
        status: 'error',
        duration,
        executionId,
        error: error.message
      }

      throw error
      
    } finally {
      this.isRunning = false
    }
  }

  /**
   * Health check method for monitoring
   */
  async healthCheck() {
    try {
      const result = await this.checkHealth()
      
      return {
        botType: this.config.botType,
        status: 'healthy',
        lastExecution: this.lastExecution,
        isRunning: this.isRunning,
        checks: result,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        botType: this.config.botType,
        status: 'unhealthy',
        error: error.message,
        lastExecution: this.lastExecution,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Input validation using Zod schemas
   */
  async validateInput(input) {
    try {
      const schema = this.getInputSchema()
      return schema.parse(input)
    } catch (validationError) {
      throw new Error(`Invalid input for ${this.config.botType}: ${validationError.message}`)
    }
  }

  /**
   * Generate unique execution ID for tracking
   */
  generateExecutionId() {
    return `${this.config.botType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Create default logger instance
   */
  createLogger() {
    return {
      info: async (message, data) => {
        if (this.config.enableLogging) {
          console.log(`[INFO] [${this.config.botType}] ${message}`, data || '')
        }
      },
      error: async (message, error, data) => {
        if (this.config.enableLogging) {
          console.error(`[ERROR] [${this.config.botType}] ${message}`, { error: error.message, ...data })
        }
      },
      warn: async (message, data) => {
        if (this.config.enableLogging) {
          console.warn(`[WARN] [${this.config.botType}] ${message}`, data || '')
        }
      }
    }
  }

  /**
   * Create default metrics instance
   */
  createMetrics() {
    return {
      recordSuccess: async (duration, result) => {
        // Default implementation - can be overridden
      },
      recordFailure: async (duration, error) => {
        // Default implementation - can be overridden
      }
    }
  }

  /**
   * Create default validator instance
   */
  createValidator() {
    return {
      validate: async (input, schema) => schema.parse(input)
    }
  }

  /**
   * Logging helper methods
   */
  async logInfo(message, data) {
    await this.logger.info(message, data)
  }

  async logError(message, error, data) {
    await this.logger.error(message, error, data)
  }

  async logWarn(message, data) {
    await this.logger.warn(message, data)
  }

  /**
   * Summarize result for logging (override in subclasses)
   */
  summarizeResult(result) {
    if (typeof result === 'object' && result !== null) {
      const keys = Object.keys(result)
      return `Object with ${keys.length} properties: ${keys.slice(0, 3).join(', ')}`
    }
    return String(result).substring(0, 100)
  }

  // Abstract methods that must be implemented by subclasses

  /**
   * Main bot processing logic - must be implemented by subclasses
   */
  async process(input, executionId) {
    throw new Error(`process() method must be implemented by ${this.constructor.name}`)
  }

  /**
   * Bot-specific input validation schema - must be implemented by subclasses
   */
  getInputSchema() {
    return z.object({
      type: z.string().optional(),
      dryRun: z.boolean().default(false)
    })
  }

  /**
   * Bot-specific health checks - must be implemented by subclasses
   */
  async checkHealth() {
    return { basic: true }
  }
}