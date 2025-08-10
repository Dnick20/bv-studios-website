import { BaseBot } from '../core/BaseBot.js'
import { z } from 'zod'

/**
 * DeploymentBot - Handles automatic Vercel deployments
 * Triggers deployments when bots make significant changes
 */
export class DeploymentBot extends BaseBot {
  constructor(config, services = {}) {
    super({
      botType: 'deployment',
      enableLogging: true,
      enableMetrics: true,
      ...config
    }, services)
    
    this.deploymentHistory = []
    this.isDeploying = false
    this.lastDeployment = null
  }

  /**
   * Get input validation schema for deployment operations
   */
  getInputSchema() {
    return z.object({
      type: z.enum(['auto', 'manual', 'scheduled']),
      trigger: z.string().optional(),
      environment: z.enum(['preview', 'production']).default('production'),
      force: z.boolean().default(false),
      dryRun: z.boolean().default(false)
    })
  }

  /**
   * Main deployment processing logic
   */
  async process(input, executionId) {
    const { type, trigger, environment, force, dryRun } = input

    await this.logInfo('Starting deployment process', {
      type,
      trigger,
      environment,
      force,
      dryRun
    })

    // Check if deployment is already in progress
    if (this.isDeploying && !force) {
      throw new Error('Deployment already in progress. Use force=true to override.')
    }

    // Check deployment readiness
    const readinessCheck = await this.checkDeploymentReadiness(environment)
    if (!readinessCheck.ready && !force) {
      throw new Error(`Deployment not ready: ${readinessCheck.reason}`)
    }

    if (dryRun) {
      return {
        deployment: 'simulated',
        type,
        environment,
        trigger,
        readinessCheck,
        dryRun: true
      }
    }

    // Execute deployment
    const deploymentResult = await this.executeDeployment({
      type,
      trigger,
      environment,
      executionId
    })

    // Update deployment history
    this.deploymentHistory.push({
      timestamp: new Date(),
      type,
      environment,
      trigger,
      status: deploymentResult.success ? 'success' : 'failed',
      executionId,
      details: deploymentResult
    })

    // Keep only last 50 deployments
    if (this.deploymentHistory.length > 50) {
      this.deploymentHistory = this.deploymentHistory.slice(-50)
    }

    return deploymentResult
  }

  /**
   * Check if deployment is ready to proceed
   */
  async checkDeploymentReadiness(environment) {
    try {
      // Check if we're in a production environment
      if (environment === 'production' && process.env.NODE_ENV === 'development') {
        return {
          ready: false,
          reason: 'Cannot deploy to production from development environment'
        }
      }

      // Check if Vercel CLI is available
      const vercelAvailable = await this.checkVercelCLI()
      if (!vercelAvailable) {
        return {
          ready: false,
          reason: 'Vercel CLI not available'
        }
      }

      // Check if git repository is clean
      const gitStatus = await this.checkGitStatus()
      if (!gitStatus.clean) {
        return {
          ready: false,
          reason: `Git repository not clean: ${gitStatus.status}`
        }
      }

      // Check if there are changes to deploy
      const hasChanges = await this.checkForChanges()
      if (!hasChanges) {
        return {
          ready: false,
          reason: 'No changes detected to deploy'
        }
      }

      return { ready: true }
    } catch (error) {
      return {
        ready: false,
        reason: `Readiness check failed: ${error.message}`
      }
    }
  }

  /**
   * Execute the actual deployment
   */
  async executeDeployment(options) {
    const { type, trigger, environment, executionId } = options
    
    this.isDeploying = true
    const startTime = Date.now()

    try {
      await this.logInfo('Starting deployment execution', options)

      // Stage and commit changes if auto deployment
      if (type === 'auto') {
        await this.stageAndCommitChanges(trigger)
      }

      // Deploy to Vercel
      const deployResult = await this.deployToVercel(environment)

      // Wait for deployment to complete
      const deploymentStatus = await this.waitForDeployment(deployResult.deploymentId)

      const duration = Date.now() - startTime
      this.lastDeployment = {
        timestamp: new Date(),
        status: deploymentStatus.status,
        deploymentId: deployResult.deploymentId,
        url: deploymentStatus.url,
        duration
      }

      await this.logInfo('Deployment completed successfully', {
        deploymentId: deployResult.deploymentId,
        url: deploymentStatus.url,
        duration
      })

      return {
        success: true,
        deploymentId: deployResult.deploymentId,
        url: deploymentStatus.url,
        duration,
        status: deploymentStatus.status
      }

    } catch (error) {
      const duration = Date.now() - startTime
      
      await this.logError('Deployment failed', error, {
        executionId,
        duration,
        options
      })

      return {
        success: false,
        error: error.message,
        duration
      }

    } finally {
      this.isDeploying = false
    }
  }

  /**
   * Stage and commit changes for auto deployment
   */
  async stageAndCommitChanges(trigger) {
    try {
      const { execSync } = await import('child_process')
      
      // Stage all changes
      execSync('git add .', { stdio: 'pipe' })
      
      // Create commit message
      const commitMessage = `Auto-deploy: ${trigger} - ${new Date().toISOString()}`
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'pipe' })
      
      // Push to remote
      execSync('git push origin main', { stdio: 'pipe' })
      
      await this.logInfo('Changes staged and committed', { trigger, commitMessage })
      
    } catch (error) {
      throw new Error(`Failed to stage and commit changes: ${error.message}`)
    }
  }

  /**
   * Deploy to Vercel using CLI
   */
  async deployToVercel(environment) {
    try {
      const { execSync } = await import('child_process')
      
      const deployCommand = environment === 'production' 
        ? 'vercel --prod --yes'
        : 'vercel --yes'
      
      const output = execSync(deployCommand, { 
        stdio: 'pipe',
        encoding: 'utf8'
      })
      
      // Parse deployment ID from output
      const deploymentIdMatch = output.match(/https:\/\/[^.]*\.vercel\.app/)
      if (!deploymentIdMatch) {
        throw new Error('Could not parse deployment URL from Vercel output')
      }
      
      const deploymentId = deploymentIdMatch[0].split('.')[0].split('//')[1]
      
      return {
        success: true,
        deploymentId,
        url: deploymentIdMatch[0]
      }
      
    } catch (error) {
      throw new Error(`Vercel deployment failed: ${error.message}`)
    }
  }

  /**
   * Wait for deployment to complete
   */
  async waitForDeployment(deploymentId) {
    const maxWaitTime = 300000 // 5 minutes
    const checkInterval = 10000 // 10 seconds
    const startTime = Date.now()

    while (Date.now() - startTime < maxWaitTime) {
      try {
        const status = await this.checkDeploymentStatus(deploymentId)
        
        if (status.status === 'READY') {
          return status
        }
        
        if (status.status === 'ERROR') {
          throw new Error(`Deployment failed: ${status.error || 'Unknown error'}`)
        }
        
        // Wait before next check
        await new Promise(resolve => setTimeout(resolve, checkInterval))
        
      } catch (error) {
        throw new Error(`Failed to check deployment status: ${error.message}`)
      }
    }
    
    throw new Error('Deployment timeout - exceeded maximum wait time')
  }

  /**
   * Check deployment status via Vercel API
   */
  async checkDeploymentStatus(deploymentId) {
    try {
      const response = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Vercel API error: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        status: data.readyState,
        url: data.url,
        error: data.error
      }
      
    } catch (error) {
      throw new Error(`Status check failed: ${error.message}`)
    }
  }

  /**
   * Check if Vercel CLI is available
   */
  async checkVercelCLI() {
    try {
      const { execSync } = await import('child_process')
      execSync('vercel --version', { stdio: 'pipe' })
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Check git repository status
   */
  async checkGitStatus() {
    try {
      const { execSync } = await import('child_process')
      const status = execSync('git status --porcelain', { 
        stdio: 'pipe',
        encoding: 'utf8'
      }).trim()
      
      return {
        clean: status === '',
        status: status || 'clean'
      }
    } catch (error) {
      return {
        clean: false,
        status: `git error: ${error.message}`
      }
    }
  }

  /**
   * Check if there are changes to deploy
   */
  async checkForChanges() {
    try {
      const { execSync } = await import('child_process')
      
      // Check if there are unpushed commits
      const unpushed = execSync('git log origin/main..HEAD --oneline', { 
        stdio: 'pipe',
        encoding: 'utf8'
      }).trim()
      
      // Check if there are uncommitted changes
      const uncommitted = execSync('git status --porcelain', { 
        stdio: 'pipe',
        encoding: 'utf8'
      }).trim()
      
      return unpushed !== '' || uncommitted !== ''
      
    } catch (error) {
      return false
    }
  }

  /**
   * Get deployment history
   */
  getDeploymentHistory() {
    return this.deploymentHistory
  }

  /**
   * Get last deployment info
   */
  getLastDeployment() {
    return this.lastDeployment
  }

  /**
   * Check if deployment is in progress
   */
  isDeploymentInProgress() {
    return this.isDeploying
  }

  /**
   * Bot-specific health checks
   */
  async checkHealth() {
    try {
      const vercelCLI = await this.checkVercelCLI()
      const gitStatus = await this.checkGitStatus()
      
      return {
        vercelCLI: vercelCLI,
        gitRepository: gitStatus.clean ? 'clean' : 'dirty',
        lastDeployment: this.lastDeployment,
        isDeploying: this.isDeploying,
        deploymentHistory: this.deploymentHistory.length
      }
    } catch (error) {
      return {
        error: error.message
      }
    }
  }

  /**
   * Trigger deployment from external source
   */
  async triggerDeployment(trigger, environment = 'production') {
    return await this.execute({
      type: 'auto',
      trigger,
      environment
    })
  }

  /**
   * Manual deployment trigger
   */
  async manualDeploy(environment = 'production') {
    return await this.execute({
      type: 'manual',
      environment
    })
  }
}
