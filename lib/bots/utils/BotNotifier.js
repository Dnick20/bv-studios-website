import nodemailer from 'nodemailer'

/**
 * Bot Notification System
 * Handles email alerts for critical bot failures and important events
 */
export class BotNotifier {
  constructor(options = {}) {
    this.config = {
      enableEmailNotifications: process.env.BOT_EMAIL_NOTIFICATIONS === 'true',
      adminEmail: process.env.ADMIN_EMAIL || 'admin@bvstudios.com',
      fromEmail: process.env.EMAIL_FROM || 'bots@bvstudios.com',
      smtpHost: process.env.EMAIL_SERVER_HOST,
      smtpPort: process.env.EMAIL_SERVER_PORT || 587,
      smtpUser: process.env.EMAIL_SERVER_USER,
      smtpPass: process.env.EMAIL_SERVER_PASSWORD,
      ...options
    }
    
    this.transporter = null
    this.initializeTransporter()
  }

  /**
   * Initialize email transporter
   */
  async initializeTransporter() {
    if (!this.config.enableEmailNotifications) {
      console.log('Email notifications disabled')
      return
    }

    if (!this.config.smtpHost) {
      console.log('Email configuration incomplete - notifications will be logged only')
      return
    }

    try {
      this.transporter = nodemailer.createTransporter({
        host: this.config.smtpHost,
        port: this.config.smtpPort,
        secure: this.config.smtpPort === 465,
        auth: {
          user: this.config.smtpUser,
          pass: this.config.smtpPass,
        },
      })

      // Test connection
      await this.transporter.verify()
      console.log('Email transporter initialized successfully')
      
    } catch (error) {
      console.error('Failed to initialize email transporter:', error.message)
      this.transporter = null
    }
  }

  /**
   * Send critical alert for system failures
   */
  async sendCriticalAlert(subject, message, errorInfo = {}) {
    const alertData = {
      level: 'CRITICAL',
      subject,
      message,
      errorInfo,
      timestamp: new Date().toISOString(),
      system: {
        environment: process.env.NODE_ENV,
        nodeVersion: process.version,
        platform: process.platform
      }
    }

    try {
      // Always log critical alerts
      console.error(`🚨 CRITICAL ALERT: ${subject}`)
      console.error(message)
      console.error('Error Info:', errorInfo)

      // Send email if configured
      if (this.transporter) {
        await this.sendEmail({
          to: this.config.adminEmail,
          subject: `🚨 CRITICAL: ${subject}`,
          html: this.generateCriticalAlertHTML(alertData),
          text: this.generateCriticalAlertText(alertData)
        })
      }

      // Log to database
      await this.logNotification('critical', subject, alertData)

    } catch (error) {
      console.error('Failed to send critical alert:', error.message)
    }
  }

  /**
   * Send warning for non-critical issues
   */
  async sendWarningAlert(subject, message, context = {}) {
    const alertData = {
      level: 'WARNING',
      subject,
      message,
      context,
      timestamp: new Date().toISOString()
    }

    try {
      console.warn(`⚠️  WARNING: ${subject}`)
      console.warn(message)

      // Send email for warnings only if explicitly enabled
      if (this.transporter && this.config.sendWarnings) {
        await this.sendEmail({
          to: this.config.adminEmail,
          subject: `⚠️ Warning: ${subject}`,
          html: this.generateWarningAlertHTML(alertData),
          text: this.generateWarningAlertText(alertData)
        })
      }

      // Log to database
      await this.logNotification('warning', subject, alertData)

    } catch (error) {
      console.error('Failed to send warning alert:', error.message)
    }
  }

  /**
   * Send bot status summary (daily/weekly reports)
   */
  async sendStatusReport(reportType, reportData) {
    if (!this.transporter) return

    const subject = `BV Studios Bot ${reportType} Report - ${new Date().toLocaleDateString()}`
    
    try {
      await this.sendEmail({
        to: this.config.adminEmail,
        subject,
        html: this.generateStatusReportHTML(reportType, reportData),
        text: this.generateStatusReportText(reportType, reportData)
      })

      console.log(`Status report sent: ${reportType}`)

    } catch (error) {
      console.error('Failed to send status report:', error.message)
    }
  }

  /**
   * Send bot success notification for important completions
   */
  async sendSuccessNotification(botType, operation, results) {
    const subject = `✅ Bot Success: ${botType} ${operation} completed`
    const message = `The ${botType} bot successfully completed ${operation} operation.`

    try {
      console.log(`✅ ${subject}`)

      // Only send email for major successes
      if (this.shouldNotifySuccess(botType, operation, results)) {
        if (this.transporter) {
          await this.sendEmail({
            to: this.config.adminEmail,
            subject,
            html: this.generateSuccessHTML(botType, operation, results),
            text: this.generateSuccessText(botType, operation, results)
          })
        }
      }

      // Log success
      await this.logNotification('success', subject, { botType, operation, results })

    } catch (error) {
      console.error('Failed to send success notification:', error.message)
    }
  }

  /**
   * Send generic email
   */
  async sendEmail({ to, subject, html, text }) {
    if (!this.transporter) {
      console.log(`Email would be sent to ${to}: ${subject}`)
      return
    }

    const mailOptions = {
      from: this.config.fromEmail,
      to,
      subject,
      html,
      text
    }

    try {
      const result = await this.transporter.sendMail(mailOptions)
      console.log(`Email sent successfully: ${result.messageId}`)
      return result
    } catch (error) {
      console.error('Failed to send email:', error.message)
      throw error
    }
  }

  /**
   * Generate HTML for critical alerts
   */
  generateCriticalAlertHTML(alertData) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #dc3545; color: white; padding: 20px; text-align: center;">
          <h1>🚨 Critical System Alert</h1>
        </div>
        
        <div style="padding: 20px; background: #f8f9fa;">
          <h2>${alertData.subject}</h2>
          <p><strong>Time:</strong> ${new Date(alertData.timestamp).toLocaleString()}</p>
          <p><strong>Environment:</strong> ${alertData.system.environment}</p>
          
          <div style="background: white; padding: 15px; border-left: 4px solid #dc3545; margin: 15px 0;">
            <p><strong>Message:</strong></p>
            <p>${alertData.message}</p>
          </div>
          
          ${alertData.errorInfo.botType ? `
            <div style="background: white; padding: 15px; margin: 15px 0;">
              <h3>Error Details</h3>
              <p><strong>Bot Type:</strong> ${alertData.errorInfo.botType}</p>
              <p><strong>Execution ID:</strong> ${alertData.errorInfo.executionId || 'N/A'}</p>
              ${alertData.errorInfo.error ? `<p><strong>Error:</strong> ${alertData.errorInfo.error}</p>` : ''}
            </div>
          ` : ''}
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #dee2e6;">
            <p><small>This alert was generated by the BV Studios Bot Management System.</small></p>
          </div>
        </div>
      </div>
    `
  }

  /**
   * Generate text for critical alerts
   */
  generateCriticalAlertText(alertData) {
    return `
🚨 CRITICAL SYSTEM ALERT

${alertData.subject}

Time: ${new Date(alertData.timestamp).toLocaleString()}
Environment: ${alertData.system.environment}

Message:
${alertData.message}

${alertData.errorInfo.botType ? `
Error Details:
- Bot Type: ${alertData.errorInfo.botType}
- Execution ID: ${alertData.errorInfo.executionId || 'N/A'}
${alertData.errorInfo.error ? `- Error: ${alertData.errorInfo.error}` : ''}
` : ''}

This alert was generated by the BV Studios Bot Management System.
    `
  }

  /**
   * Generate HTML for warning alerts
   */
  generateWarningAlertHTML(alertData) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ffc107; color: #212529; padding: 20px; text-align: center;">
          <h1>⚠️ System Warning</h1>
        </div>
        
        <div style="padding: 20px; background: #f8f9fa;">
          <h2>${alertData.subject}</h2>
          <p><strong>Time:</strong> ${new Date(alertData.timestamp).toLocaleString()}</p>
          
          <div style="background: white; padding: 15px; border-left: 4px solid #ffc107; margin: 15px 0;">
            <p>${alertData.message}</p>
          </div>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #dee2e6;">
            <p><small>This warning was generated by the BV Studios Bot Management System.</small></p>
          </div>
        </div>
      </div>
    `
  }

  /**
   * Generate text for warning alerts
   */
  generateWarningAlertText(alertData) {
    return `
⚠️ SYSTEM WARNING

${alertData.subject}

Time: ${new Date(alertData.timestamp).toLocaleString()}

Message:
${alertData.message}

This warning was generated by the BV Studios Bot Management System.
    `
  }

  /**
   * Generate HTML for status reports
   */
  generateStatusReportHTML(reportType, reportData) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #28a745; color: white; padding: 20px; text-align: center;">
          <h1>📊 Bot System ${reportType} Report</h1>
        </div>
        
        <div style="padding: 20px; background: #f8f9fa;">
          <p><strong>Report Date:</strong> ${new Date().toLocaleDateString()}</p>
          
          <div style="background: white; padding: 15px; margin: 15px 0;">
            <h3>System Health</h3>
            <p><strong>Overall Status:</strong> ${reportData.overall || 'Unknown'}</p>
            <p><strong>Active Bots:</strong> ${reportData.summary?.healthy || 0}</p>
            <p><strong>Issues:</strong> ${reportData.summary?.unhealthy || 0}</p>
          </div>
          
          ${reportData.activities ? `
            <div style="background: white; padding: 15px; margin: 15px 0;">
              <h3>Recent Activities</h3>
              <ul>
                ${reportData.activities.map(activity => `<li>${activity}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #dee2e6;">
            <p><small>Generated by the BV Studios Bot Management System.</small></p>
          </div>
        </div>
      </div>
    `
  }

  /**
   * Generate text for status reports
   */
  generateStatusReportText(reportType, reportData) {
    return `
📊 BV STUDIOS BOT SYSTEM ${reportType.toUpperCase()} REPORT

Report Date: ${new Date().toLocaleDateString()}

System Health:
- Overall Status: ${reportData.overall || 'Unknown'}
- Active Bots: ${reportData.summary?.healthy || 0}
- Issues: ${reportData.summary?.unhealthy || 0}

${reportData.activities ? `
Recent Activities:
${reportData.activities.map(activity => `- ${activity}`).join('\n')}
` : ''}

Generated by the BV Studios Bot Management System.
    `
  }

  /**
   * Generate success notification HTML
   */
  generateSuccessHTML(botType, operation, results) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #28a745; color: white; padding: 20px; text-align: center;">
          <h1>✅ Bot Operation Successful</h1>
        </div>
        
        <div style="padding: 20px; background: #f8f9fa;">
          <h2>${botType} - ${operation}</h2>
          <p><strong>Completed:</strong> ${new Date().toLocaleString()}</p>
          
          <div style="background: white; padding: 15px; margin: 15px 0;">
            <h3>Results Summary</h3>
            <p>${this.formatResults(results)}</p>
          </div>
        </div>
      </div>
    `
  }

  /**
   * Generate success notification text
   */
  generateSuccessText(botType, operation, results) {
    return `
✅ BOT OPERATION SUCCESSFUL

${botType} - ${operation}
Completed: ${new Date().toLocaleString()}

Results:
${this.formatResults(results)}
    `
  }

  /**
   * Determine if success should trigger notification
   */
  shouldNotifySuccess(botType, operation, results) {
    // Only notify for major operations or significant results
    const majorOperations = ['cleanup', 'maintenance', 'analytics', 'migration']
    
    if (majorOperations.includes(operation)) return true
    
    // Notify if significant numbers affected
    if (results && typeof results === 'object') {
      const numbers = Object.values(results).filter(val => typeof val === 'number')
      if (numbers.some(num => num > 100)) return true
    }
    
    return false
  }

  /**
   * Format results for display
   */
  formatResults(results) {
    if (typeof results === 'string') return results
    if (typeof results === 'object' && results !== null) {
      return Object.entries(results)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ')
    }
    return String(results)
  }

  /**
   * Log notification to database
   */
  async logNotification(level, subject, data) {
    try {
      const { prisma } = await import('../../prisma.js')
      await prisma.botLog.create({
        data: {
          botType: 'notifier',
          action: 'notification',
          status: level,
          data: JSON.stringify({ subject, ...data })
        }
      })
    } catch (error) {
      console.error('Failed to log notification:', error.message)
    }
  }

  /**
   * Test email configuration
   */
  async testEmailConfiguration() {
    if (!this.transporter) {
      return { success: false, error: 'Email transporter not initialized' }
    }

    try {
      await this.sendEmail({
        to: this.config.adminEmail,
        subject: '✅ BV Studios Bot Email Test',
        html: '<p>This is a test email from the BV Studios Bot Management System.</p>',
        text: 'This is a test email from the BV Studios Bot Management System.'
      })

      return { success: true, message: 'Test email sent successfully' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}