import { BotManager } from './BotManager.js'
import { DatabaseBot } from '../handlers/DatabaseBot.js'
import { DeploymentBot } from '../handlers/DeploymentBot.js'
import { getGlobalAutoDeployTrigger } from '../utils/AutoDeployTrigger.js'

/**
 * Simple Cron Parser - Alternative to node-cron for ES modules compatibility
 */
class SimpleCron {
  static schedule(cronExpression, callback, options = {}) {
    const task = new ScheduledTask(cronExpression, callback, options)
    return task
  }
}

class ScheduledTask {
  constructor(cronExpression, callback, options = {}) {
    this.cronExpression = cronExpression
    this.callback = callback
    this.options = options
    this.intervalId = null
    this.running = false
    
    if (options.scheduled !== false) {
      this.start()
    }
  }

  start() {
    if (this.running) return
    this.running = true
    
    // Simple scheduler - check every minute if task should run
    this.intervalId = setInterval(() => {
      if (this.shouldRun()) {
        this.callback()
      }
    }, 60000) // Check every minute
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.running = false
  }

  shouldRun() {
    const now = new Date()
    const [minute, hour, dayOfMonth, month, dayOfWeek] = this.cronExpression.split(' ')
    
    // Simple cron matching - supports basic patterns
    return (
      this.matchField(minute, now.getMinutes()) &&
      this.matchField(hour, now.getHours()) &&
      this.matchField(dayOfMonth, now.getDate()) &&
      this.matchField(month, now.getMonth() + 1) &&
      this.matchField(dayOfWeek, now.getDay())
    )
  }

  matchField(pattern, value) {
    if (pattern === '*') return true
    if (pattern.includes(',')) {
      return pattern.split(',').some(p => this.matchSingle(p.trim(), value))
    }
    return this.matchSingle(pattern, value)
  }

  matchSingle(pattern, value) {
    if (pattern === '*') return true
    if (pattern.includes('/')) {
      const [range, step] = pattern.split('/')
      const stepValue = parseInt(step)
      return value % stepValue === 0
    }
    return parseInt(pattern) === value
  }
}

/**
 * Bot Scheduler - Manages automated bot execution
 * Based on production scheduling patterns with error handling and monitoring
 */
export class BotScheduler {
  constructor(options = {}) {
    this.scheduledTasks = new Map()
    this.botManager = options.botManager || this.createBotManager()
    this.config = {
      enableScheduling: process.env.NODE_ENV !== 'test',
      timezone: 'America/New_York', // Adjust for your timezone
      ...options.config
    }
    
    this.isRunning = false
  }

  /**
   * Initialize and start all scheduled tasks
   */
  async start() {
    if (!this.config.enableScheduling) {
      console.log('Bot scheduling disabled (test environment)')
      return
    }

    if (this.isRunning) {
      console.log('Bot scheduler is already running')
      return
    }

    // Use our simple cron implementation

    console.log('🤖 Starting Bot Scheduler...')

    try {
      // Register bots with the manager
      await this.registerBots()

      // Setup scheduled tasks
      await this.setupScheduledTasks()

      this.isRunning = true
      console.log('✅ Bot Scheduler started successfully')
      
      // Log startup
      await this.logSchedulerActivity('started', { 
        tasksScheduled: this.scheduledTasks.size,
        environment: process.env.NODE_ENV 
      })

    } catch (error) {
      console.error('❌ Failed to start Bot Scheduler:', error.message)
      await this.logSchedulerActivity('startup_failed', { error: error.message })
      throw error
    }
  }

  /**
   * Stop all scheduled tasks
   */
  async stop() {
    console.log('🛑 Stopping Bot Scheduler...')

    // Stop all cron tasks
    for (const [taskName, task] of this.scheduledTasks) {
      try {
        task.stop()
        console.log(`Stopped task: ${taskName}`)
      } catch (error) {
        console.error(`Failed to stop task ${taskName}:`, error.message)
      }
    }

    this.scheduledTasks.clear()
    this.isRunning = false

    await this.logSchedulerActivity('stopped', { 
      tasksStopped: this.scheduledTasks.size 
    })
    
    console.log('✅ Bot Scheduler stopped')
  }

  /**
   * Register bots with the manager
   */
  async registerBots() {
    this.botManager.registerBot('database', DatabaseBot, {
      enableLogging: true,
      enableMetrics: true
    })
    
    this.botManager.registerBot('deployment', DeploymentBot, {
      enableLogging: true,
      enableMetrics: true
    })
    
    // TODO: Register other bots as they're implemented
    // this.botManager.registerBot('content', ContentBot, {...})
    // this.botManager.registerBot('lead', LeadBot, {...})
  }

  /**
   * Setup all scheduled tasks
   */
  async setupScheduledTasks() {
    // Daily database cleanup at 2:00 AM
    this.scheduleTask(
      'daily-cleanup',
      '0 2 * * *', // Every day at 2:00 AM
      () => this.runDatabaseCleanup(),
      'Daily database cleanup and maintenance'
    )

    // Weekly analytics generation on Sunday at 1:00 AM
    this.scheduleTask(
      'weekly-analytics',
      '0 1 * * 0', // Every Sunday at 1:00 AM
      () => this.runWeeklyAnalytics(),
      'Weekly database analytics generation'
    )

    // Health check every hour
    this.scheduleTask(
      'hourly-health-check',
      '0 * * * *', // Every hour
      () => this.runHealthChecks(),
      'Hourly system health monitoring'
    )

    // Monthly maintenance on the 1st at 3:00 AM
    this.scheduleTask(
      'monthly-maintenance',
      '0 3 1 * *', // 1st of every month at 3:00 AM
      () => this.runMonthlyMaintenance(),
      'Monthly comprehensive maintenance'
    )
  }

  /**
   * Schedule a task with error handling and logging
   */
  scheduleTask(taskName, cronExpression, taskFunction, description) {
    const task = SimpleCron.schedule(cronExpression, async () => {
      const startTime = Date.now()
      
      try {
        console.log(`⏰ Running scheduled task: ${taskName}`)
        await this.logSchedulerActivity('task_started', { 
          taskName, 
          description 
        })

        await taskFunction()

        const duration = Date.now() - startTime
        console.log(`✅ Completed scheduled task: ${taskName} (${duration}ms)`)
        
        await this.logSchedulerActivity('task_completed', { 
          taskName, 
          duration 
        })

      } catch (error) {
        const duration = Date.now() - startTime
        console.error(`❌ Scheduled task failed: ${taskName}`, error.message)
        
        await this.logSchedulerActivity('task_failed', { 
          taskName, 
          error: error.message, 
          duration 
        })

        // Don't throw - let other scheduled tasks continue
      }
    }, {
      scheduled: true
    })

    this.scheduledTasks.set(taskName, task)
    console.log(`📅 Scheduled task: ${taskName} - ${description} (${cronExpression})`)
  }

  /**
   * Run database cleanup operation
   */
  async runDatabaseCleanup() {
    try {
      const result = await this.botManager.executeBot('database', {
        type: 'cleanup',
        options: {
          dryRun: false, // Real cleanup
          includeAnalytics: false
        }
      })

      console.log('Database cleanup completed:', result.data.cleanup)
      return result

    } catch (error) {
      console.error('Database cleanup failed:', error.message)
      throw new Error(`Scheduled database cleanup failed: ${error.message}`)
    }
  }

  /**
   * Generate weekly analytics
   */
  async runWeeklyAnalytics() {
    try {
      const result = await this.botManager.executeBot('database', {
        type: 'analytics',
        options: {
          includeAnalytics: true
        }
      })

      console.log('Weekly analytics generated:', {
        quotes: result.data.analytics.quotes,
        users: result.data.analytics.users,
        trend: result.data.analytics.trends.trend
      })
      
      return result

    } catch (error) {
      console.error('Weekly analytics generation failed:', error.message)
      throw new Error(`Scheduled analytics generation failed: ${error.message}`)
    }
  }

  /**
   * Run health checks on all systems
   */
  async runHealthChecks() {
    try {
      const health = await this.botManager.getSystemHealth()
      
      // Log only if there are issues
      if (health.overall !== 'healthy') {
        console.warn(`System health check: ${health.overall}`, {
          unhealthy: health.summary.unhealthy,
          disabled: health.summary.disabled
        })
      }

      return health

    } catch (error) {
      console.error('Health check failed:', error.message)
      throw new Error(`Scheduled health check failed: ${error.message}`)
    }
  }

  /**
   * Run comprehensive monthly maintenance
   */
  async runMonthlyMaintenance() {
    try {
      const result = await this.botManager.executeBot('database', {
        type: 'maintenance',
        options: {
          dryRun: false,
          includeAnalytics: true
        }
      })

      console.log('Monthly maintenance completed:', {
        cleanup: result.data.maintenance.cleanup,
        optimization: result.data.maintenance.optimization
      })
      
      return result

    } catch (error) {
      console.error('Monthly maintenance failed:', error.message)
      throw new Error(`Scheduled monthly maintenance failed: ${error.message}`)
    }
  }

  /**
   * Get scheduler status
   */
  getStatus() {
    const tasks = []
    
    for (const [taskName, task] of this.scheduledTasks) {
      tasks.push({
        name: taskName,
        running: task.running
      })
    }

    // Get auto-deployment status
    const autoDeployStatus = getGlobalAutoDeployTrigger().getDeploymentStatus()

    return {
      isRunning: this.isRunning,
      totalTasks: this.scheduledTasks.size,
      tasks,
      timezone: this.config.timezone,
      environment: process.env.NODE_ENV,
      autoDeploy: autoDeployStatus
    }
  }

  /**
   * Manually trigger a scheduled task (for testing/admin)
   */
  async triggerTask(taskName) {
    if (!this.scheduledTasks.has(taskName)) {
      throw new Error(`Scheduled task '${taskName}' not found`)
    }

    console.log(`🔧 Manually triggering task: ${taskName}`)
    
    switch (taskName) {
      case 'daily-cleanup':
        return await this.runDatabaseCleanup()
      case 'weekly-analytics':
        return await this.runWeeklyAnalytics()
      case 'hourly-health-check':
        return await this.runHealthChecks()
      case 'monthly-maintenance':
        return await this.runMonthlyMaintenance()
      default:
        throw new Error(`Unknown task: ${taskName}`)
    }
  }

  /**
   * Log scheduler activity to database
   */
  async logSchedulerActivity(action, data) {
    try {
      const { prisma } = await import('../../prisma.js')
      await prisma.botLog.create({
        data: {
          botType: 'scheduler',
          action,
          status: data.error ? 'error' : 'success',
          data: JSON.stringify(data)
        }
      })
    } catch (error) {
      console.error('Failed to log scheduler activity:', error.message)
    }
  }

  /**
   * Create default bot manager
   */
  createBotManager() {
    return new BotManager({
      config: {
        circuitBreakerThreshold: 3, // Lower threshold for scheduled tasks
        circuitBreakerTimeout: 300000 // 5 minutes
      }
    })
  }
}

// Singleton instance for the application
let globalScheduler = null

export function getGlobalScheduler() {
  if (!globalScheduler) {
    globalScheduler = new BotScheduler()
  }
  return globalScheduler
}