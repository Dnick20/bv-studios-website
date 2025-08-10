import { BaseBot } from '../core/BaseBot.js'
import { z } from 'zod'
import { prisma } from '../../prisma.js'

/**
 * Lead Intelligence Bot
 * Handles intelligent lead processing, scoring, and qualification
 */
export class LeadBot extends BaseBot {
  constructor(config = {}) {
    super({
      botType: 'lead',
      ...config
    })

    // Lead scoring weights
    this.scoringWeights = {
      budget: 30,      // Package selection indicates budget
      timeline: 25,    // How soon is the event
      engagement: 20,  // Response to follow-ups
      fit: 15,        // Venue and guest count alignment
      urgency: 10     // Special requests or rush indicators
    }
  }

  /**
   * Main processing logic for lead operations
   */
  async process(input, executionId) {
    const { type, options = {} } = input
    const results = {}

    try {
      switch (type) {
        case 'score-leads':
          results.leadScoring = await this.scoreLeads(options, executionId)
          break
          
        case 'qualify-inquiries':
          results.qualification = await this.qualifyInquiries(options, executionId)
          break
          
        case 'route-leads':
          results.routing = await this.routeLeads(options, executionId)
          break
          
        case 'follow-up-analysis':
          results.followUp = await this.analyzeFollowUps(options, executionId)
          break

        case 'conversion-tracking':
          results.conversion = await this.trackConversions(options, executionId)
          break
          
        default:
          throw new Error(`Unknown lead operation type: ${type}`)
      }

      // Log successful operation
      if (!this.config.dryRun) {
        await this.logBotActivity('success', results)
      }

      return results

    } catch (error) {
      // Log failed operation
      if (!this.config.dryRun) {
        await this.logBotActivity('error', { error: error.message })
      }
      throw error
    }
  }

  /**
   * Score leads based on multiple criteria
   */
  async scoreLeads(options = {}, executionId) {
    await this.logInfo('Starting lead scoring analysis', { executionId, options })

    try {
      // Get quotes for scoring
      const quotes = await prisma.weddingQuote.findMany({
        include: {
          package: true,
          venue: true,
          user: { select: { name: true, email: true } },
          quoteAddons: { include: { addon: true } }
        },
        where: {
          status: options.status || 'pending',
          createdAt: options.dateRange ? {
            gte: options.dateRange.from,
            lte: options.dateRange.to
          } : undefined
        },
        orderBy: { createdAt: 'desc' },
        take: options.limit || 20
      })

      const scoredLeads = []

      for (const quote of quotes) {
        const score = this.calculateLeadScore(quote)
        const category = this.categorizeLeadQuality(score)
        const recommendations = this.generateRecommendations(quote, score)

        scoredLeads.push({
          quoteId: quote.id,
          clientName: quote.user?.name || 'Anonymous',
          email: quote.user?.email,
          score,
          category,
          packageName: quote.package?.name,
          totalPrice: quote.totalPrice,
          eventDate: quote.eventDate,
          daysUntilEvent: Math.ceil((quote.eventDate - new Date()) / (1000 * 60 * 60 * 24)),
          recommendations,
          urgency: this.calculateUrgency(quote),
          breakdown: this.getScoreBreakdown(quote)
        })
      }

      // Sort by score (highest first)
      scoredLeads.sort((a, b) => b.score - a.score)

      const summary = {
        total: scoredLeads.length,
        highQuality: scoredLeads.filter(l => l.category === 'high').length,
        mediumQuality: scoredLeads.filter(l => l.category === 'medium').length,
        lowQuality: scoredLeads.filter(l => l.category === 'low').length,
        averageScore: scoredLeads.length > 0 
          ? Math.round(scoredLeads.reduce((sum, l) => sum + l.score, 0) / scoredLeads.length)
          : 0
      }

      await this.logInfo('Lead scoring completed', { 
        executionId, 
        summary 
      })

      return {
        summary,
        leads: scoredLeads
      }

    } catch (error) {
      await this.logError('Lead scoring failed', error, { executionId })
      throw new Error(`Lead scoring failed: ${error.message}`)
    }
  }

  /**
   * Qualify incoming inquiries
   */
  async qualifyInquiries(options = {}, executionId) {
    await this.logInfo('Starting inquiry qualification', { executionId, options })

    try {
      // Get recent quotes that need qualification
      const recentQuotes = await prisma.weddingQuote.findMany({
        include: {
          package: true,
          venue: true,
          user: { select: { name: true, email: true } }
        },
        where: {
          status: 'pending',
          createdAt: {
            gte: new Date(Date.now() - (options.daysSince || 7) * 24 * 60 * 60 * 1000)
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      const qualifiedInquiries = recentQuotes.map(quote => {
        const qualification = this.qualifyInquiry(quote)
        return {
          quoteId: quote.id,
          clientName: quote.user?.name || 'Anonymous',
          email: quote.user?.email,
          ...qualification,
          eventDate: quote.eventDate,
          packageName: quote.package?.name,
          totalPrice: quote.totalPrice
        }
      })

      const qualificationSummary = {
        total: qualifiedInquiries.length,
        qualified: qualifiedInquiries.filter(q => q.qualified).length,
        needsAttention: qualifiedInquiries.filter(q => q.needsAttention).length,
        followUpRequired: qualifiedInquiries.filter(q => q.followUpRequired).length
      }

      await this.logInfo('Inquiry qualification completed', { 
        executionId, 
        summary: qualificationSummary 
      })

      return {
        summary: qualificationSummary,
        inquiries: qualifiedInquiries
      }

    } catch (error) {
      await this.logError('Inquiry qualification failed', error, { executionId })
      throw new Error(`Inquiry qualification failed: ${error.message}`)
    }
  }

  /**
   * Route leads to appropriate team members
   */
  async routeLeads(options = {}, executionId) {
    await this.logInfo('Starting lead routing', { executionId, options })

    try {
      // Get high-priority leads
      const scoringResult = await this.scoreLeads({ 
        status: 'pending', 
        limit: 10 
      }, executionId)
      
      const routingRules = {
        'high-value': { // High budget quotes
          criteria: (lead) => lead.score >= 80,
          assignTo: 'senior_producer',
          priority: 'urgent'
        },
        'wedding-specialist': { // Wedding-specific routing
          criteria: (lead) => lead.packageName?.toLowerCase().includes('wedding'),
          assignTo: 'wedding_coordinator',
          priority: 'high'
        },
        'urgent-timeline': { // Events within 30 days
          criteria: (lead) => lead.daysUntilEvent <= 30,
          assignTo: 'operations_manager',
          priority: 'urgent'
        },
        'standard': { // Default routing
          criteria: () => true,
          assignTo: 'sales_team',
          priority: 'normal'
        }
      }

      const routedLeads = scoringResult.leads.map(lead => {
        for (const [ruleName, rule] of Object.entries(routingRules)) {
          if (rule.criteria(lead)) {
            return {
              ...lead,
              routing: {
                rule: ruleName,
                assignedTo: rule.assignTo,
                priority: rule.priority,
                routedAt: new Date().toISOString(),
                reason: this.getRoutingReason(ruleName, lead)
              }
            }
          }
        }
        return lead
      })

      const routingSummary = {
        totalRouted: routedLeads.length,
        urgent: routedLeads.filter(l => l.routing?.priority === 'urgent').length,
        high: routedLeads.filter(l => l.routing?.priority === 'high').length,
        normal: routedLeads.filter(l => l.routing?.priority === 'normal').length,
        assignments: this.summarizeAssignments(routedLeads)
      }

      await this.logInfo('Lead routing completed', { 
        executionId, 
        summary: routingSummary 
      })

      return {
        summary: routingSummary,
        routedLeads
      }

    } catch (error) {
      await this.logError('Lead routing failed', error, { executionId })
      throw new Error(`Lead routing failed: ${error.message}`)
    }
  }

  /**
   * Analyze follow-up patterns and effectiveness
   */
  async analyzeFollowUps(options = {}, executionId) {
    await this.logInfo('Analyzing follow-up patterns', { executionId, options })

    try {
      // Get quotes with follow-up history
      const quotes = await prisma.weddingQuote.findMany({
        include: {
          package: true,
          user: { select: { name: true, email: true } }
        },
        where: {
          lastEmailSent: {
            not: null
          },
          createdAt: {
            gte: new Date(Date.now() - (options.daysSince || 30) * 24 * 60 * 60 * 1000)
          }
        },
        orderBy: { lastEmailSent: 'desc' }
      })

      const followUpAnalysis = quotes.map(quote => {
        const daysSinceInquiry = Math.ceil((new Date() - quote.createdAt) / (1000 * 60 * 60 * 24))
        const daysSinceLastContact = quote.lastEmailSent 
          ? Math.ceil((new Date() - quote.lastEmailSent) / (1000 * 60 * 60 * 24))
          : null

        return {
          quoteId: quote.id,
          clientName: quote.user?.name || 'Anonymous',
          daysSinceInquiry,
          daysSinceLastContact,
          emailType: quote.emailType || 'unknown',
          status: quote.status,
          needsFollowUp: this.needsFollowUp(quote, daysSinceLastContact),
          recommendedAction: this.getRecommendedFollowUpAction(quote, daysSinceLastContact),
          priority: this.getFollowUpPriority(quote, daysSinceInquiry, daysSinceLastContact)
        }
      })

      const summary = {
        totalAnalyzed: followUpAnalysis.length,
        needsFollowUp: followUpAnalysis.filter(f => f.needsFollowUp).length,
        overdue: followUpAnalysis.filter(f => f.daysSinceLastContact > 7).length,
        highPriority: followUpAnalysis.filter(f => f.priority === 'high').length,
        averageDaysBetweenContacts: this.calculateAverageFollowUpTime(followUpAnalysis)
      }

      await this.logInfo('Follow-up analysis completed', { 
        executionId, 
        summary 
      })

      return {
        summary,
        followUps: followUpAnalysis.filter(f => f.needsFollowUp)
      }

    } catch (error) {
      await this.logError('Follow-up analysis failed', error, { executionId })
      throw new Error(`Follow-up analysis failed: ${error.message}`)
    }
  }

  /**
   * Track conversion rates and patterns
   */
  async trackConversions(options = {}, executionId) {
    await this.logInfo('Tracking conversion patterns', { executionId, options })

    try {
      const timeframe = options.timeframeDays || 90

      // Get conversion data
      const totalQuotes = await prisma.weddingQuote.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - timeframe * 24 * 60 * 60 * 1000)
          }
        }
      })

      const approvedQuotes = await prisma.weddingQuote.count({
        where: {
          status: 'approved',
          createdAt: {
            gte: new Date(Date.now() - timeframe * 24 * 60 * 60 * 1000)
          }
        }
      })

      const conversionsByPackage = await prisma.weddingQuote.groupBy({
        by: ['packageId'],
        where: {
          createdAt: {
            gte: new Date(Date.now() - timeframe * 24 * 60 * 60 * 1000)
          }
        },
        _count: {
          id: true
        }
      })

      const approvedByPackage = await prisma.weddingQuote.groupBy({
        by: ['packageId'],
        where: {
          status: 'approved',
          createdAt: {
            gte: new Date(Date.now() - timeframe * 24 * 60 * 60 * 1000)
          }
        },
        _count: {
          id: true
        }
      })

      const overallConversionRate = totalQuotes > 0 
        ? Math.round((approvedQuotes / totalQuotes) * 100)
        : 0

      const packageConversions = conversionsByPackage.map(pkg => {
        const approved = approvedByPackage.find(a => a.packageId === pkg.packageId)?._count.id || 0
        const conversionRate = pkg._count.id > 0 
          ? Math.round((approved / pkg._count.id) * 100)
          : 0

        return {
          packageId: pkg.packageId,
          totalQuotes: pkg._count.id,
          approvedQuotes: approved,
          conversionRate
        }
      })

      const conversionMetrics = {
        timeframeDays: timeframe,
        totalQuotes,
        approvedQuotes,
        overallConversionRate,
        packageConversions: packageConversions.sort((a, b) => b.conversionRate - a.conversionRate),
        trends: {
          improving: overallConversionRate > 25, // Benchmark
          needsAttention: overallConversionRate < 15
        }
      }

      await this.logInfo('Conversion tracking completed', { 
        executionId, 
        metrics: conversionMetrics 
      })

      return conversionMetrics

    } catch (error) {
      await this.logError('Conversion tracking failed', error, { executionId })
      throw new Error(`Conversion tracking failed: ${error.message}`)
    }
  }

  // Helper methods for lead scoring and qualification

  calculateLeadScore(quote) {
    let score = 0

    // Budget score (30 points) - based on package selection
    const budgetScore = this.getBudgetScore(quote.totalPrice)
    score += budgetScore * (this.scoringWeights.budget / 100)

    // Timeline score (25 points) - events sooner are higher priority
    const timelineScore = this.getTimelineScore(quote.eventDate)
    score += timelineScore * (this.scoringWeights.timeline / 100)

    // Engagement score (20 points) - placeholder for future tracking
    const engagementScore = 75 // Default mid-range
    score += engagementScore * (this.scoringWeights.engagement / 100)

    // Fit score (15 points) - venue and guest count alignment
    const fitScore = this.getFitScore(quote)
    score += fitScore * (this.scoringWeights.fit / 100)

    // Urgency score (10 points) - special requests indicate urgency
    const urgencyScore = this.getUrgencyScore(quote)
    score += urgencyScore * (this.scoringWeights.urgency / 100)

    return Math.round(score)
  }

  getBudgetScore(totalPrice) {
    // Higher budget = higher score
    if (totalPrice >= 500000) return 100 // $5000+
    if (totalPrice >= 300000) return 80  // $3000+
    if (totalPrice >= 200000) return 60  // $2000+
    if (totalPrice >= 100000) return 40  // $1000+
    return 20
  }

  getTimelineScore(eventDate) {
    const daysUntilEvent = Math.ceil((eventDate - new Date()) / (1000 * 60 * 60 * 24))
    
    if (daysUntilEvent <= 30) return 100  // Very urgent
    if (daysUntilEvent <= 60) return 80   // Urgent
    if (daysUntilEvent <= 120) return 60  // Normal
    if (daysUntilEvent <= 180) return 40  // Planned
    return 20 // Far future
  }

  getFitScore(quote) {
    let score = 50 // Base score
    
    // Bonus for having venue selected
    if (quote.venueId || quote.venueName) {
      score += 25
    }
    
    // Bonus for guest count specified
    if (quote.guestCount) {
      score += 25
    }
    
    return Math.min(score, 100)
  }

  getUrgencyScore(quote) {
    let score = 50 // Base score
    
    if (quote.specialRequests) {
      const requests = quote.specialRequests.toLowerCase()
      if (requests.includes('urgent') || requests.includes('asap') || requests.includes('rush')) {
        score += 50
      }
      if (requests.length > 100) { // Detailed requests show engagement
        score += 25
      }
    }
    
    return Math.min(score, 100)
  }

  categorizeLeadQuality(score) {
    if (score >= 80) return 'high'
    if (score >= 60) return 'medium'
    return 'low'
  }

  generateRecommendations(quote, score) {
    const recommendations = []
    
    if (score >= 80) {
      recommendations.push('High-priority lead - contact within 2 hours')
      recommendations.push('Assign to senior team member')
    }
    
    if (this.getTimelineScore(quote.eventDate) >= 80) {
      recommendations.push('Urgent timeline - prioritize immediate response')
    }
    
    if (quote.totalPrice >= 300000) {
      recommendations.push('High-value opportunity - personalized approach recommended')
    }
    
    if (!quote.venueId && !quote.venueName) {
      recommendations.push('Offer venue consultation to increase engagement')
    }
    
    return recommendations
  }

  calculateUrgency(quote) {
    const daysUntilEvent = Math.ceil((quote.eventDate - new Date()) / (1000 * 60 * 60 * 24))
    
    if (daysUntilEvent <= 30) return 'critical'
    if (daysUntilEvent <= 60) return 'high'
    if (daysUntilEvent <= 120) return 'medium'
    return 'low'
  }

  getScoreBreakdown(quote) {
    return {
      budget: this.getBudgetScore(quote.totalPrice),
      timeline: this.getTimelineScore(quote.eventDate),
      engagement: 75, // Placeholder
      fit: this.getFitScore(quote),
      urgency: this.getUrgencyScore(quote)
    }
  }

  qualifyInquiry(quote) {
    const score = this.calculateLeadScore(quote)
    const daysOld = Math.ceil((new Date() - quote.createdAt) / (1000 * 60 * 60 * 24))
    
    return {
      qualified: score >= 50,
      score,
      reason: score >= 50 ? 'Meets qualification criteria' : 'Below qualification threshold',
      needsAttention: daysOld > 2 && quote.status === 'pending',
      followUpRequired: daysOld > 1 && !quote.lastEmailSent,
      priority: this.calculateUrgency(quote)
    }
  }

  getRoutingReason(ruleName, lead) {
    const reasons = {
      'high-value': `High-value lead (score: ${lead.score}, budget: $${(lead.totalPrice / 100).toLocaleString()})`,
      'wedding-specialist': `Wedding-specific expertise required (${lead.packageName})`,
      'urgent-timeline': `Urgent timeline (${lead.daysUntilEvent} days until event)`,
      'standard': 'Standard routing based on availability'
    }
    
    return reasons[ruleName] || 'Automatic routing'
  }

  summarizeAssignments(routedLeads) {
    const assignments = {}
    
    routedLeads.forEach(lead => {
      const assignee = lead.routing?.assignedTo || 'unassigned'
      if (!assignments[assignee]) {
        assignments[assignee] = { count: 0, urgent: 0, high: 0, normal: 0 }
      }
      assignments[assignee].count++
      assignments[assignee][lead.routing?.priority || 'normal']++
    })
    
    return assignments
  }

  needsFollowUp(quote, daysSinceLastContact) {
    if (!daysSinceLastContact) return true
    if (quote.status === 'pending' && daysSinceLastContact > 3) return true
    if (quote.status === 'pending' && daysSinceLastContact > 7) return true
    return false
  }

  getRecommendedFollowUpAction(quote, daysSinceLastContact) {
    if (!quote.lastEmailSent) return 'Send initial follow-up'
    if (daysSinceLastContact > 7) return 'Send gentle reminder'
    if (daysSinceLastContact > 14) return 'Phone call recommended'
    return 'Continue monitoring'
  }

  getFollowUpPriority(quote, daysSinceInquiry, daysSinceLastContact) {
    const score = this.calculateLeadScore(quote)
    
    if (score >= 80 && daysSinceLastContact > 2) return 'high'
    if (score >= 60 && daysSinceLastContact > 5) return 'medium'
    if (daysSinceLastContact > 10) return 'high'
    return 'low'
  }

  calculateAverageFollowUpTime(followUpData) {
    const validData = followUpData.filter(f => f.daysSinceLastContact !== null)
    if (validData.length === 0) return 0
    
    const total = validData.reduce((sum, f) => sum + f.daysSinceLastContact, 0)
    return Math.round(total / validData.length)
  }

  /**
   * Log bot activity to database
   */
  async logBotActivity(status, data) {
    try {
      await prisma.botLog.create({
        data: {
          botType: this.config.botType,
          action: 'lead_processing',
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
      type: z.enum(['score-leads', 'qualify-inquiries', 'route-leads', 'follow-up-analysis', 'conversion-tracking']),
      options: z.object({
        limit: z.number().min(1).max(100).default(20),
        status: z.string().optional(),
        daysSince: z.number().min(1).max(365).default(30),
        timeframeDays: z.number().min(1).max(365).default(90),
        dateRange: z.object({
          from: z.date(),
          to: z.date()
        }).optional()
      }).optional().default({})
    })
  }

  /**
   * Bot health check implementation
   */
  async checkHealth() {
    try {
      // Check database connectivity and recent data
      const recentQuotes = await prisma.weddingQuote.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      })
      
      return {
        database: true,
        recentQuotes,
        lastExecution: this.lastExecution,
        isRunning: this.isRunning,
        capabilities: ['score-leads', 'qualify-inquiries', 'route-leads', 'follow-up-analysis', 'conversion-tracking']
      }
    } catch (error) {
      return {
        database: false,
        error: error.message
      }
    }
  }
}