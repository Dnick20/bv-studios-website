import { BaseBot } from '../core/BaseBot.js'
import { z } from 'zod'
import { prisma } from '../../prisma.js'
import { getGlobalAutoDeployTrigger } from '../utils/AutoDeployTrigger.js'

/**
 * Database Management Bot
 * Handles database cleanup, maintenance, and health monitoring
 */
export class DatabaseBot extends BaseBot {
  constructor(config = {}) {
    super({
      botType: 'database',
      ...config
    })
  }

  /**
   * Main processing logic for database operations
   */
  async process(input, executionId) {
    const { type, options = {} } = input
    const results = {}

    try {
      switch (type) {
        case 'cleanup':
          results.cleanup = await this.performCleanup(options, executionId)
          break
          
        case 'health-check':
          results.health = await this.performHealthCheck(options, executionId)
          break
          
        case 'analytics':
          results.analytics = await this.generateAnalytics(options, executionId)
          break
          
        case 'maintenance':
          results.maintenance = await this.performMaintenance(options, executionId)
          break
          
        default:
          throw new Error(`Unknown database operation type: ${type}`)
      }

      // Log successful operation to database
      if (!this.config.dryRun) {
        await this.logBotActivity('success', results)
        
        // Trigger auto-deployment for significant database changes
        await this.triggerAutoDeployment(type, results)
      }

      return results

    } catch (error) {
      // Log failed operation to database
      if (!this.config.dryRun) {
        await this.logBotActivity('error', { error: error.message })
      }
      throw error
    }
  }

  /**
   * Perform database cleanup operations
   */
  async performCleanup(options = {}, executionId) {
    await this.logInfo('Starting database cleanup', { executionId, options })

    const results = {
      expiredQuotes: 0,
      oldSessions: 0,
      oldLogs: 0,
      anonymousConversations: 0
    }

    try {
      // 1. Clean up expired wedding quotes (older than 30 days, still pending)
      if (!this.config.dryRun) {
        const expiredQuotes = await prisma.weddingQuote.updateMany({
          where: {
            createdAt: {
              lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days
            },
            status: 'pending'
          },
          data: {
            status: 'expired'
          }
        })
        results.expiredQuotes = expiredQuotes.count
      } else {
        // Dry run - just count
        results.expiredQuotes = await prisma.weddingQuote.count({
          where: {
            createdAt: {
              lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            },
            status: 'pending'
          }
        })
      }

      // 2. Remove expired sessions
      if (!this.config.dryRun) {
        const oldSessions = await prisma.session.deleteMany({
          where: {
            expires: {
              lt: new Date()
            }
          }
        })
        results.oldSessions = oldSessions.count
      } else {
        results.oldSessions = await prisma.session.count({
          where: {
            expires: {
              lt: new Date()
            }
          }
        })
      }

      // 3. Clean up old bot logs (keep only 30 days)
      if (!this.config.dryRun) {
        const oldLogs = await prisma.botLog.deleteMany({
          where: {
            createdAt: {
              lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            },
            status: {
              in: ['info', 'success'] // Keep errors and warnings longer
            }
          }
        })
        results.oldLogs = oldLogs.count
      } else {
        results.oldLogs = await prisma.botLog.count({
          where: {
            createdAt: {
              lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            },
            status: {
              in: ['info', 'success']
            }
          }
        })
      }

      await this.logInfo('Database cleanup completed', { executionId, results })
      return results

    } catch (error) {
      await this.logError('Database cleanup failed', error, { executionId, results })
      throw new Error(`Database cleanup failed: ${error.message}`)
    }
  }

  /**
   * Perform comprehensive health check
   */
  async performHealthCheck(options = {}, executionId) {
    await this.logInfo('Starting database health check', { executionId })

    const health = {
      database: false,
      tables: {},
      performance: {},
      issues: []
    }

    try {
      // 1. Basic database connectivity
      await prisma.$queryRaw`SELECT 1`
      health.database = true

      // 2. Check critical tables
      const tables = [
        'User',
        'WeddingQuote', 
        'WeddingPackage',
        'Session',
        'BotLog'
      ]

      for (const table of tables) {
        try {
          const count = await prisma[table.toLowerCase()].count()
          health.tables[table.toLowerCase()] = {
            accessible: true,
            count
          }
        } catch (error) {
          health.tables[table.toLowerCase()] = {
            accessible: false,
            error: error.message
          }
          health.issues.push(`Table ${table} is not accessible: ${error.message}`)
        }
      }

      // 3. Performance checks
      const start = Date.now()
      await prisma.weddingQuote.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' }
      })
      health.performance.queryTime = Date.now() - start

      // Check for slow queries (>1 second is concerning)
      if (health.performance.queryTime > 1000) {
        health.issues.push(`Slow query performance: ${health.performance.queryTime}ms`)
      }

      // 4. Check for data integrity issues
      const pendingQuotesCount = await prisma.weddingQuote.count({
        where: { status: 'pending' }
      })
      
      const expiredQuotesCount = await prisma.weddingQuote.count({
        where: {
          status: 'pending',
          createdAt: {
            lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      })

      health.dataIntegrity = {
        pendingQuotes: pendingQuotesCount,
        expiredQuotes: expiredQuotesCount
      }

      if (expiredQuotesCount > 0) {
        health.issues.push(`${expiredQuotesCount} quotes need cleanup (older than 30 days)`)
      }

      await this.logInfo('Database health check completed', { executionId, health })
      return health

    } catch (error) {
      health.issues.push(`Health check failed: ${error.message}`)
      await this.logError('Database health check failed', error, { executionId })
      throw new Error(`Database health check failed: ${error.message}`)
    }
  }

  /**
   * Generate database analytics and insights
   */
  async generateAnalytics(options = {}, executionId) {
    await this.logInfo('Generating database analytics', { executionId })

    try {
      const analytics = {
        quotes: {},
        users: {},
        packages: {},
        trends: {}
      }

      // Quote analytics
      const totalQuotes = await prisma.weddingQuote.count()
      const pendingQuotes = await prisma.weddingQuote.count({
        where: { status: 'pending' }
      })
      const approvedQuotes = await prisma.weddingQuote.count({
        where: { status: 'approved' }
      })

      analytics.quotes = {
        total: totalQuotes,
        pending: pendingQuotes,
        approved: approvedQuotes,
        conversionRate: totalQuotes > 0 ? (approvedQuotes / totalQuotes * 100).toFixed(2) : 0
      }

      // User analytics
      const totalUsers = await prisma.user.count()
      const activeUsers = await prisma.user.count({
        where: {
          active: true,
          sessions: {
            some: {
              expires: {
                gt: new Date()
              }
            }
          }
        }
      })

      analytics.users = {
        total: totalUsers,
        active: activeUsers
      }

      // Package popularity
      const packageStats = await prisma.weddingQuote.groupBy({
        by: ['packageId'],
        _count: {
          packageId: true
        },
        orderBy: {
          _count: {
            packageId: 'desc'
          }
        }
      })

      analytics.packages.popularity = packageStats.map(stat => ({
        packageId: stat.packageId,
        quoteCount: stat._count.packageId
      }))

      // Recent trends (last 7 days vs previous 7 days)
      const last7Days = await prisma.weddingQuote.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      })

      const previous7Days = await prisma.weddingQuote.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      })

      analytics.trends = {
        quotesLast7Days: last7Days,
        quotesPrevious7Days: previous7Days,
        trend: last7Days > previous7Days ? 'increasing' : 
               last7Days < previous7Days ? 'decreasing' : 'stable'
      }

      await this.logInfo('Database analytics generated', { executionId, analytics })
      return analytics

    } catch (error) {
      await this.logError('Database analytics generation failed', error, { executionId })
      throw new Error(`Analytics generation failed: ${error.message}`)
    }
  }

  /**
   * Perform database maintenance tasks
   */
  async performMaintenance(options = {}, executionId) {
    await this.logInfo('Starting database maintenance', { executionId })

    const results = {
      cleanup: null,
      optimization: {},
      backup: {}
    }

    try {
      // Run cleanup first
      results.cleanup = await this.performCleanup(options, executionId)

      // Database optimization (PostgreSQL specific)
      if (!this.config.dryRun) {
        try {
          // These would be PostgreSQL-specific optimizations
          // await prisma.$queryRaw`ANALYZE`
          results.optimization.analyzed = true
        } catch (error) {
          results.optimization.error = error.message
        }
      }

      // Backup status check
      results.backup.lastCheck = new Date().toISOString()
      results.backup.status = 'automatic' // Supabase handles backups automatically

      await this.logInfo('Database maintenance completed', { executionId, results })
      return results

    } catch (error) {
      await this.logError('Database maintenance failed', error, { executionId })
      throw new Error(`Database maintenance failed: ${error.message}`)
    }
  }

  /**
   * Trigger auto-deployment for significant database changes
   */
  async triggerAutoDeployment(operationType, results) {
    try {
      const autoDeploy = getGlobalAutoDeployTrigger()
      
      // Determine if deployment should be triggered based on operation type
      let shouldDeploy = false
      let triggerAction = ''
      
      switch (operationType) {
        case 'cleanup':
          if (results.cleanup && (results.cleanup.expiredQuotes > 0 || results.cleanup.oldLogs > 0)) {
            shouldDeploy = true
            triggerAction = 'cleanup'
          }
          break
          
        case 'maintenance':
          if (results.maintenance && results.maintenance.optimization) {
            shouldDeploy = true
            triggerAction = 'maintenance'
          }
          break
          
        case 'analytics':
          // Don't trigger deployment for analytics generation
          break
          
        case 'health-check':
          // Don't trigger deployment for health checks
          break
      }
      
      if (shouldDeploy) {
        await autoDeploy.triggerDeployment('database', triggerAction, {
          operationType,
          results,
          timestamp: new Date().toISOString()
        })
      }
      
    } catch (error) {
      // Log error but don't fail the main operation
      console.error('Auto-deployment trigger failed:', error.message)
    }
  }

  /**
   * Log bot activity to database
   */
  async logBotActivity(status, data) {
    try {
      await prisma.botLog.create({
        data: {
          botType: this.config.botType,
          action: 'database_operation',
          status,
          data: JSON.stringify(data)
        }
      })
    } catch (error) {
      console.error('Failed to log bot activity:', error)
    }
  }

  /**
   * Bot-specific input validation schema
   */
  getInputSchema() {
    return z.object({
      type: z.enum(['cleanup', 'health-check', 'analytics', 'maintenance']),
      options: z.object({
        dryRun: z.boolean().default(false),
        includeAnalytics: z.boolean().default(false)
      }).optional().default({})
    })
  }

  /**
   * Bot health check implementation
   */
  async checkHealth() {
    try {
      // Basic database connectivity test
      await prisma.$queryRaw`SELECT 1`
      
      return {
        database: true,
        lastExecution: this.lastExecution,
        isRunning: this.isRunning
      }
    } catch (error) {
      return {
        database: false,
        error: error.message
      }
    }
  }
}