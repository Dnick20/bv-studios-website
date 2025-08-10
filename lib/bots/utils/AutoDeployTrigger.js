import { DeploymentBot } from '../handlers/DeploymentBot.js'

/**
 * AutoDeployTrigger - Automatically triggers deployments when bots make changes
 * Integrates with existing bot system to deploy changes to Vercel
 */
export class AutoDeployTrigger {
  constructor(config = {}) {
    this.config = {
      enabled: process.env.AUTO_DEPLOY_ENABLED === 'true',
      triggers: {
        database: ['schema_change', 'migration', 'cleanup'],
        content: ['content_update', 'seo_change'],
        lead: ['lead_processing', 'quote_update']
      },
      deploymentDelay: 30000, // 30 seconds delay before deployment
      maxDeploymentsPerHour: 5,
      ...config
    }
    
    this.deploymentBot = new DeploymentBot({
      enableLogging: true,
      enableMetrics: true
    })
    
    this.pendingDeployments = new Map()
    this.deploymentCount = 0
    this.lastDeploymentReset = Date.now()
    
    // Initialize if auto-deploy is enabled
    if (this.config.enabled) {
      this.initialize()
    }
  }

  /**
   * Initialize the auto-deploy system
   */
  initialize() {
    console.log('🚀 Auto-deploy system initialized')
    
    // Reset deployment count every hour
    setInterval(() => {
      this.deploymentCount = 0
      this.lastDeploymentReset = Date.now()
    }, 3600000) // 1 hour
  }

  /**
   * Check if deployment should be triggered
   */
  shouldTriggerDeployment(botType, action) {
    if (!this.config.enabled) {
      return false
    }

    // Check if action is in trigger list
    const triggerActions = this.config.triggers[botType] || []
    if (!triggerActions.includes(action)) {
      return false
    }

    // Check deployment rate limit
    if (this.deploymentCount >= this.config.maxDeploymentsPerHour) {
      console.log(`⚠️ Deployment rate limit reached (${this.config.maxDeploymentsPerHour}/hour)`)
      return false
    }

    // Check if deployment is already pending
    const deploymentKey = `${botType}_${action}`
    if (this.pendingDeployments.has(deploymentKey)) {
      return false
    }

    return true
  }

  /**
   * Trigger auto-deployment for bot action
   */
  async triggerDeployment(botType, action, metadata = {}) {
    if (!this.shouldTriggerDeployment(botType, action)) {
      return {
        triggered: false,
        reason: 'Deployment not needed or rate limited'
      }
    }

    const deploymentKey = `${botType}_${action}`
    const trigger = `${botType}:${action}`
    
    console.log(`🚀 Auto-deploy triggered: ${trigger}`)
    
    // Mark deployment as pending
    this.pendingDeployments.set(deploymentKey, {
      timestamp: Date.now(),
      metadata
    })

    // Schedule deployment with delay
    setTimeout(async () => {
      try {
        await this.executeDeployment(trigger, metadata)
        this.pendingDeployments.delete(deploymentKey)
        this.deploymentCount++
      } catch (error) {
        console.error(`❌ Auto-deployment failed for ${trigger}:`, error.message)
        this.pendingDeployments.delete(deploymentKey)
      }
    }, this.config.deploymentDelay)

    return {
      triggered: true,
      deploymentKey,
      scheduledTime: Date.now() + this.config.deploymentDelay
    }
  }

  /**
   * Execute the actual deployment
   */
  async executeDeployment(trigger, metadata) {
    try {
      console.log(`🚀 Executing auto-deployment for: ${trigger}`)
      
      const result = await this.deploymentBot.execute({
        type: 'auto',
        trigger,
        environment: 'production',
        dryRun: false
      })

      if (result.success) {
        console.log(`✅ Auto-deployment successful: ${result.url}`)
        
        // Log deployment success
        await this.logDeploymentSuccess(trigger, result, metadata)
      } else {
        throw new Error(result.error || 'Deployment failed')
      }

      return result

    } catch (error) {
      console.error(`❌ Auto-deployment execution failed:`, error.message)
      
      // Log deployment failure
      await this.logDeploymentFailure(trigger, error, metadata)
      
      throw error
    }
  }

  /**
   * Log successful deployment
   */
  async logDeploymentSuccess(trigger, result, metadata) {
    try {
      const { prisma } = await import('../../prisma.js')
      
      await prisma.botLog.create({
        data: {
          botType: 'deployment',
          action: 'auto_deploy_success',
          status: 'success',
          data: JSON.stringify({
            trigger,
            result,
            metadata,
            timestamp: new Date().toISOString()
          })
        }
      })
    } catch (error) {
      console.error('Failed to log deployment success:', error.message)
    }
  }

  /**
   * Log deployment failure
   */
  async logDeploymentFailure(trigger, error, metadata) {
    try {
      const { prisma } = await import('../../prisma.js')
      
      await prisma.botLog.create({
        data: {
          botType: 'deployment',
          action: 'auto_deploy_failure',
          status: 'error',
          data: JSON.stringify({
            trigger,
            error: error.message,
            metadata,
            timestamp: new Date().toISOString()
          })
        }
      })
    } catch (error) {
      console.error('Failed to log deployment failure:', error.message)
    }
  }

  /**
   * Get deployment status
   */
  getDeploymentStatus() {
    return {
      enabled: this.config.enabled,
      pendingDeployments: Array.from(this.pendingDeployments.entries()).map(([key, data]) => ({
        key,
        ...data
      })),
      deploymentCount: this.deploymentCount,
      maxDeploymentsPerHour: this.config.maxDeploymentsPerHour,
      lastDeploymentReset: this.lastDeploymentReset
    }
  }

  /**
   * Get deployment bot instance
   */
  getDeploymentBot() {
    return this.deploymentBot
  }

  /**
   * Manual deployment trigger
   */
  async manualDeploy(environment = 'production') {
    return await this.deploymentBot.manualDeploy(environment)
  }

  /**
   * Check if auto-deploy is enabled
   */
  isEnabled() {
    return this.config.enabled
  }

  /**
   * Enable/disable auto-deploy
   */
  setEnabled(enabled) {
    this.config.enabled = enabled
    if (enabled) {
      this.initialize()
    }
    console.log(`Auto-deploy ${enabled ? 'enabled' : 'disabled'}`)
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig }
    console.log('Auto-deploy configuration updated')
  }
}

// Singleton instance
let globalAutoDeployTrigger = null

export function getGlobalAutoDeployTrigger() {
  if (!globalAutoDeployTrigger) {
    globalAutoDeployTrigger = new AutoDeployTrigger()
  }
  return globalAutoDeployTrigger
}
