/**
 * Comprehensive error handler for bot operations
 * Based on Azure Bot Framework instrumentation patterns
 */
export class ErrorHandler {
  constructor(options = {}) {
    this.enableNotifications = options.enableNotifications !== false
    this.enableLogging = options.enableLogging !== false
    this.notifier = options.notifier || this.createDefaultNotifier()
    this.logger = options.logger || this.createDefaultLogger()
  }

  /**
   * Main error handling method
   */
  async handleError(error, context = {}) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      code: error.code,
      name: error.name,
      timestamp: new Date().toISOString(),
      context
    }

    try {
      // Categorize error severity
      const severity = this.categorizeError(error)
      errorInfo.severity = severity
      
      // Log error with appropriate level
      if (this.enableLogging) {
        await this.logError(severity, errorInfo)
      }

      // Handle based on severity
      switch (severity) {
        case 'critical':
          await this.handleCriticalError(error, errorInfo)
          break
        case 'warning':
          await this.handleWarningError(error, errorInfo)
          break
        default:
          await this.handleStandardError(error, errorInfo)
      }

    } catch (handlingError) {
      // If error handling itself fails, log to console as fallback
      console.error('Error handler failed:', handlingError)
      console.error('Original error:', errorInfo)
    }

    // Return standardized error response
    return {
      success: false,
      error: {
        message: this.getSafeErrorMessage(error),
        code: error.code || 'UNKNOWN_ERROR',
        severity: errorInfo.severity || 'standard',
        timestamp: errorInfo.timestamp,
        executionId: context.executionId
      }
    }
  }

  /**
   * Categorize error based on type and characteristics
   */
  categorizeError(error) {
    // Database connection errors - critical
    if (error.code === 'ECONNREFUSED' || 
        error.code === 'ENOTFOUND' || 
        error.code === 'ETIMEDOUT') {
      return 'critical'
    }
    
    // Prisma database errors
    if (error.code && error.code.startsWith('P')) {
      switch (error.code) {
        case 'P2002': // Unique constraint violation
        case 'P2025': // Record not found
          return 'warning'
        case 'P2003': // Foreign key constraint
        case 'P2004': // Constraint failed
          return 'warning'
        case 'P1001': // Cannot reach database
        case 'P1002': // Database timeout
          return 'critical'
        default:
          return 'standard'
      }
    }
    
    // Memory or timeout errors - critical
    if (error.message.toLowerCase().includes('memory') || 
        error.message.toLowerCase().includes('timeout') ||
        error.message.toLowerCase().includes('heap')) {
      return 'critical'
    }
    
    // Rate limit errors - warning
    if (error.message.toLowerCase().includes('rate limit') ||
        error.message.toLowerCase().includes('too many requests')) {
      return 'warning'
    }

    // Validation errors - standard
    if (error.name === 'ValidationError' || error.name === 'ZodError') {
      return 'standard'
    }
    
    return 'standard'
  }

  /**
   * Handle critical errors that require immediate attention
   */
  async handleCriticalError(error, errorInfo) {
    if (this.enableNotifications) {
      try {
        await this.notifier.sendCriticalAlert(
          `Critical Bot Error - ${errorInfo.context.botType || 'Unknown'}`,
          `A critical error occurred in the bot system that requires immediate attention.\n\n` +
          `Error: ${error.message}\n` +
          `Bot Type: ${errorInfo.context.botType || 'Unknown'}\n` +
          `Execution ID: ${errorInfo.context.executionId || 'Unknown'}\n` +
          `Time: ${errorInfo.timestamp}\n\n` +
          `This may indicate a system-wide issue that could affect bot operations.`,
          errorInfo
        )
      } catch (notificationError) {
        console.error('Failed to send critical alert:', notificationError)
      }
    }
    
    // Consider disabling the affected bot temporarily
    if (errorInfo.context.botType) {
      await this.recordBotFailure(errorInfo.context.botType, error)
    }
  }

  /**
   * Handle warning errors that need attention but aren't critical
   */
  async handleWarningError(error, errorInfo) {
    // Log for analysis but don't send immediate alerts
    console.warn(`Bot warning in ${errorInfo.context.botType}:`, error.message)
    
    // Track pattern for potential issues
    await this.trackErrorPattern(errorInfo.context.botType, error.code, error.message)
  }

  /**
   * Handle standard errors with basic logging
   */
  async handleStandardError(error, errorInfo) {
    // Standard logging - no special action needed
    console.log(`Bot error in ${errorInfo.context.botType}:`, error.message)
  }

  /**
   * Log error with appropriate level
   */
  async logError(severity, errorInfo) {
    const logMethod = {
      'critical': 'error',
      'warning': 'warn',
      'standard': 'info'
    }[severity] || 'error'

    await this.logger[logMethod](`Bot ${severity} error`, errorInfo)
  }

  /**
   * Get safe error message for client response
   */
  getSafeErrorMessage(error) {
    // Don't expose sensitive system information
    const sensitivePatterns = [
      /password/i,
      /token/i,
      /key/i,
      /secret/i,
      /connection string/i
    ]

    let message = error.message

    for (const pattern of sensitivePatterns) {
      if (pattern.test(message)) {
        return 'An internal error occurred. Please try again later.'
      }
    }

    // Return original message if safe
    return message
  }

  /**
   * Record bot failure for circuit breaker pattern
   */
  async recordBotFailure(botType, error) {
    // This would integrate with BotManager's circuit breaker
    console.log(`Recording failure for bot ${botType}: ${error.message}`)
  }

  /**
   * Track error patterns for analysis
   */
  async trackErrorPattern(botType, errorCode, errorMessage) {
    // Track recurring error patterns
    const pattern = `${botType}:${errorCode}`
    console.log(`Tracking error pattern: ${pattern} - ${errorMessage}`)
  }

  /**
   * Create default notifier (can be replaced with email service)
   */
  createDefaultNotifier() {
    return {
      sendCriticalAlert: async (subject, message, errorInfo) => {
        console.error(`CRITICAL ALERT: ${subject}`)
        console.error(message)
        // In production, this would send an actual email/Slack notification
      }
    }
  }

  /**
   * Create default logger
   */
  createDefaultLogger() {
    return {
      error: async (message, data) => {
        console.error(`[ERROR] ${message}`, data)
      },
      warn: async (message, data) => {
        console.warn(`[WARN] ${message}`, data)
      },
      info: async (message, data) => {
        console.log(`[INFO] ${message}`, data)
      }
    }
  }

  /**
   * Static method for quick error handling
   */
  static async handle(error, context = {}) {
    const handler = new ErrorHandler()
    return await handler.handleError(error, context)
  }
}