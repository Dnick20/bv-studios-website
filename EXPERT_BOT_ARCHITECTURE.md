# Expert Bot Architecture & Code Structure (Based on Production Systems)

## **🏗️ Architecture Patterns from Industry Leaders**

Based on analysis of production-grade bot systems from Microsoft, Azure, Automation Anywhere, and enterprise frameworks, this document outlines the optimal code structure for BV Studios' bot system.

---

## **📁 Recommended Directory Structure**

```
├── lib/
│   ├── bots/
│   │   ├── core/
│   │   │   ├── BaseBot.js           # Abstract base class for all bots
│   │   │   ├── BotManager.js        # Central bot coordination
│   │   │   ├── BotScheduler.js      # Cron job management
│   │   │   └── BotValidator.js      # Input validation layer
│   │   ├── handlers/
│   │   │   ├── DatabaseBot.js       # Database management operations
│   │   │   ├── ContentBot.js        # Content generation operations
│   │   │   ├── LeadBot.js          # Lead intelligence operations
│   │   │   ├── AnalyticsBot.js     # Business intelligence
│   │   │   └── WorkflowBot.js      # Process automation
│   │   ├── middleware/
│   │   │   ├── ErrorHandler.js     # Global error handling
│   │   │   ├── Logger.js           # Structured logging
│   │   │   ├── RateLimiter.js      # Request throttling
│   │   │   └── HealthChecker.js    # System health monitoring
│   │   └── utils/
│   │       ├── BotConfig.js        # Environment configuration
│   │       ├── BotMetrics.js       # Performance tracking
│   │       └── BotNotifier.js      # Alert system
│   └── services/
│       ├── DatabaseService.js      # Database abstraction layer
│       ├── EmailService.js         # Email operations
│       └── AnalyticsService.js     # Data processing
├── pages/api/admin/
│   ├── bots/
│   │   ├── health.js              # Health check endpoint
│   │   ├── metrics.js             # Performance metrics
│   │   ├── logs.js                # Log retrieval
│   │   └── [botType].js           # Individual bot endpoints
├── tests/
│   ├── bots/
│   │   ├── unit/                  # Unit tests for individual bots
│   │   ├── integration/           # Integration tests
│   │   └── e2e/                   # End-to-end tests
└── config/
    ├── bots.json                  # Bot configuration
    └── schedules.json             # Cron schedules
```

---

## **🎯 Core Architecture Patterns**

### **1. Clean Architecture with Dependency Injection**
*Based on Microsoft Bot Framework and clean architecture principles*

```javascript
// lib/bots/core/BaseBot.js
import { BotValidator } from './BotValidator.js'
import { Logger } from '../middleware/Logger.js'
import { BotMetrics } from '../utils/BotMetrics.js'

export class BaseBot {
  constructor(config, services = {}) {
    this.config = config
    this.validator = services.validator || new BotValidator()
    this.logger = services.logger || new Logger(config.botType)
    this.metrics = services.metrics || new BotMetrics(config.botType)
    this.startTime = null
  }

  async execute(input) {
    const startTime = Date.now()
    const executionId = this.generateExecutionId()
    
    try {
      // Validate input
      const validInput = await this.validator.validate(input, this.getSchema())
      
      // Log execution start
      await this.logger.info('Bot execution started', {
        executionId,
        botType: this.config.botType,
        input: validInput
      })

      // Execute bot logic
      const result = await this.process(validInput)

      // Record success metrics
      const duration = Date.now() - startTime
      await this.metrics.recordSuccess(duration, result)

      return {
        success: true,
        executionId,
        data: result,
        duration
      }

    } catch (error) {
      const duration = Date.now() - startTime
      await this.handleError(error, executionId, duration)
      throw error
    }
  }

  // Abstract method - must be implemented by subclasses
  async process(input) {
    throw new Error('process() method must be implemented by subclass')
  }

  // Abstract method - must be implemented by subclasses
  getSchema() {
    throw new Error('getSchema() method must be implemented by subclass')
  }
}
```

### **2. Middleware-Based Error Handling**
*Based on Azure Bot Framework instrumentation patterns*

```javascript
// lib/bots/middleware/ErrorHandler.js
import { Logger } from './Logger.js'
import { BotNotifier } from '../utils/BotNotifier.js'

export class ErrorHandler {
  constructor() {
    this.logger = new Logger('ErrorHandler')
    this.notifier = new BotNotifier()
  }

  async handleError(error, context = {}) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      code: error.code,
      timestamp: new Date().toISOString(),
      context
    }

    // Categorize error severity
    const severity = this.categorizeError(error)
    
    // Log error with appropriate level
    await this.logger.error('Bot execution error', errorInfo)

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

    // Return standardized error response
    return {
      success: false,
      error: {
        message: this.getSafeErrorMessage(error),
        code: error.code || 'UNKNOWN_ERROR',
        timestamp: errorInfo.timestamp
      }
    }
  }

  categorizeError(error) {
    // Database connection errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return 'critical'
    }
    
    // Prisma constraint violations (data issues, not system issues)
    if (error.code === 'P2002' || error.code === 'P2025') {
      return 'warning'
    }
    
    // Memory or timeout errors
    if (error.message.includes('memory') || error.message.includes('timeout')) {
      return 'critical'
    }
    
    return 'standard'
  }

  async handleCriticalError(error, errorInfo) {
    // Notify administrators immediately
    await this.notifier.sendCriticalAlert(
      'Bot Critical Error',
      `Critical error in bot system: ${error.message}`,
      errorInfo
    )
    
    // Disable affected bot if needed
    if (errorInfo.context.botType) {
      await this.disableBotTemporarily(errorInfo.context.botType)
    }
  }
}
```

### **3. Structured Logging System**
*Based on production logging frameworks from Automation Anywhere*

```javascript
// lib/bots/middleware/Logger.js
import { prisma } from '../../prisma.js'

export class Logger {
  constructor(botType, options = {}) {
    this.botType = botType
    this.enableConsole = options.enableConsole !== false
    this.enableDatabase = options.enableDatabase !== false
    this.logLevel = options.logLevel || 'info'
  }

  async log(level, message, data = null, duration = null) {
    const logEntry = {
      level,
      message,
      botType: this.botType,
      timestamp: new Date(),
      data: data ? JSON.stringify(data) : null,
      duration
    }

    // Console logging for development
    if (this.enableConsole && this.shouldLog(level)) {
      console.log(`[${logEntry.timestamp.toISOString()}] [${level.toUpperCase()}] [${this.botType}] ${message}`, data || '')
    }

    // Database logging for production
    if (this.enableDatabase) {
      try {
        await prisma.botLog.create({
          data: {
            botType: this.botType,
            action: this.extractAction(message),
            status: this.levelToStatus(level),
            data: logEntry.data,
            duration
          }
        })
      } catch (dbError) {
        console.error('Failed to log to database:', dbError)
      }
    }

    return logEntry
  }

  async info(message, data, duration) {
    return this.log('info', message, data, duration)
  }

  async warn(message, data, duration) {
    return this.log('warn', message, data, duration)
  }

  async error(message, data, duration) {
    return this.log('error', message, data, duration)
  }

  async debug(message, data, duration) {
    return this.log('debug', message, data, duration)
  }
}
```

### **4. Bot Manager with Circuit Breaker Pattern**
*Based on microservices resilience patterns*

```javascript
// lib/bots/core/BotManager.js
import { BaseBot } from './BaseBot.js'
import { ErrorHandler } from '../middleware/ErrorHandler.js'

export class BotManager {
  constructor() {
    this.bots = new Map()
    this.circuitBreakers = new Map()
    this.errorHandler = new ErrorHandler()
  }

  registerBot(botType, botClass, config) {
    this.bots.set(botType, {
      class: botClass,
      config,
      instance: null
    })
    
    // Initialize circuit breaker for this bot
    this.circuitBreakers.set(botType, {
      failures: 0,
      lastFailure: null,
      state: 'closed', // closed, open, half-open
      threshold: 5,
      timeout: 60000 // 1 minute
    })
  }

  async executeBot(botType, input) {
    const circuitBreaker = this.circuitBreakers.get(botType)
    
    // Check circuit breaker
    if (this.isCircuitOpen(circuitBreaker)) {
      throw new Error(`Bot ${botType} is temporarily disabled due to repeated failures`)
    }

    try {
      const bot = this.getBotInstance(botType)
      const result = await bot.execute(input)
      
      // Reset circuit breaker on success
      this.resetCircuitBreaker(botType)
      
      return result
      
    } catch (error) {
      // Update circuit breaker on failure
      this.recordFailure(botType)
      
      // Handle error through middleware
      return await this.errorHandler.handleError(error, {
        botType,
        input,
        circuitBreaker: circuitBreaker.state
      })
    }
  }

  getBotInstance(botType) {
    const botInfo = this.bots.get(botType)
    if (!botInfo) {
      throw new Error(`Bot type '${botType}' not registered`)
    }

    // Lazy instantiation
    if (!botInfo.instance) {
      botInfo.instance = new botInfo.class(botInfo.config)
    }

    return botInfo.instance
  }

  isCircuitOpen(circuitBreaker) {
    if (circuitBreaker.state === 'open') {
      const timeSinceLastFailure = Date.now() - circuitBreaker.lastFailure
      if (timeSinceLastFailure > circuitBreaker.timeout) {
        circuitBreaker.state = 'half-open'
        return false
      }
      return true
    }
    return false
  }
}
```

### **5. Health Check System**
*Based on production monitoring patterns*

```javascript
// pages/api/admin/bots/health.js
import { BotManager } from '../../../../lib/bots/core/BotManager.js'
import { prisma } from '../../../../lib/prisma.js'

export default async function handler(req, res) {
  const healthReport = {
    timestamp: new Date().toISOString(),
    overall: 'healthy',
    bots: {},
    database: false,
    scheduler: false,
    alerts: []
  }

  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`
    healthReport.database = true

    // Check each bot's health
    const botManager = new BotManager()
    const botTypes = ['database', 'content', 'lead', 'analytics', 'workflow']

    for (const botType of botTypes) {
      try {
        const result = await botManager.executeBot(botType, { 
          type: 'health-check',
          dryRun: true 
        })
        
        healthReport.bots[botType] = {
          status: 'healthy',
          lastExecution: result.timestamp,
          responseTime: result.duration
        }
      } catch (error) {
        healthReport.bots[botType] = {
          status: 'unhealthy',
          error: error.message,
          timestamp: new Date().toISOString()
        }
        healthReport.alerts.push(`Bot ${botType} is unhealthy: ${error.message}`)
      }
    }

    // Check scheduler (verify recent executions)
    const recentLogs = await prisma.botLog.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 25 * 60 * 60 * 1000) // 25 hours
        },
        action: 'scheduled'
      }
    })
    
    healthReport.scheduler = recentLogs > 0

    // Determine overall health
    const unhealthyBots = Object.values(healthReport.bots).filter(bot => bot.status === 'unhealthy')
    if (unhealthyBots.length > 0 || !healthReport.database || !healthReport.scheduler) {
      healthReport.overall = 'degraded'
    }

    const statusCode = healthReport.overall === 'healthy' ? 200 : 503
    return res.status(statusCode).json(healthReport)

  } catch (error) {
    healthReport.overall = 'critical'
    healthReport.alerts.push(`System health check failed: ${error.message}`)
    
    return res.status(503).json({
      ...healthReport,
      error: error.message
    })
  }
}
```

---

## **🚀 Key Architecture Benefits**

### **1. Scalability**
- **Microservice-style bot isolation**: Each bot operates independently
- **Circuit breaker pattern**: Prevents cascade failures
- **Lazy loading**: Bots instantiated only when needed

### **2. Maintainability**
- **Clean Architecture**: Clear separation of concerns
- **Dependency Injection**: Easy testing and configuration
- **Abstract base classes**: Consistent behavior across all bots

### **3. Observability**
- **Structured logging**: Consistent log format across all bots
- **Health checks**: Real-time system monitoring
- **Metrics collection**: Performance tracking and optimization

### **4. Resilience**
- **Comprehensive error handling**: Graceful degradation
- **Retry mechanisms**: Exponential backoff for transient failures
- **Alert system**: Immediate notification of critical issues

### **5. Testability**
- **Dependency injection**: Easy mocking for tests
- **Abstract interfaces**: Test individual components in isolation
- **Health endpoints**: Automated testing integration

---

## **📊 Implementation Priority**

1. **Phase 1**: Core architecture (BaseBot, BotManager, ErrorHandler)
2. **Phase 2**: First bot implementation (DatabaseBot) using the framework
3. **Phase 3**: Logging and monitoring systems
4. **Phase 4**: Remaining bots following the established pattern
5. **Phase 5**: Advanced features (circuit breakers, metrics dashboard)

This architecture follows proven patterns from Microsoft, Azure, and enterprise automation frameworks while maintaining the simplicity needed for your specific use case.