import { BaseBot } from '../core/BaseBot.js'
import { z } from 'zod'
import { prisma } from '../../prisma.js'

/**
 * Content Generation Bot
 * Handles SEO descriptions, social media captions, email templates, and marketing content
 */
export class ContentBot extends BaseBot {
  constructor(config = {}) {
    super({
      botType: 'content',
      ...config
    })
  }

  /**
   * Main processing logic for content generation
   */
  async process(input, executionId) {
    const { type, options = {} } = input
    const results = {}

    try {
      switch (type) {
        case 'seo-descriptions':
          results.seoDescriptions = await this.generateSEODescriptions(options, executionId)
          break
          
        case 'social-captions':
          results.socialCaptions = await this.generateSocialCaptions(options, executionId)
          break
          
        case 'email-templates':
          results.emailTemplates = await this.generateEmailTemplates(options, executionId)
          break
          
        case 'quote-summaries':
          results.quoteSummaries = await this.generateQuoteSummaries(options, executionId)
          break

        case 'blog-posts':
          results.blogPosts = await this.generateBlogPosts(options, executionId)
          break
          
        default:
          throw new Error(`Unknown content generation type: ${type}`)
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
   * Generate SEO descriptions for media items
   */
  async generateSEODescriptions(options = {}, executionId) {
    await this.logInfo('Generating SEO descriptions', { executionId, options })

    try {
      // Get media items that need SEO descriptions
      const mediaItems = await prisma.media.findMany({
        where: {
          type: options.mediaType || undefined,
          category: options.category || undefined
        },
        take: options.limit || 10
      })

      const results = []

      for (const item of mediaItems) {
        const seoDescription = this.createSEODescription(item)
        
        if (!this.config.dryRun) {
          // In a real implementation, you might update the media record
          // or store SEO data in a separate table
          await this.logInfo('Generated SEO description', {
            mediaId: item.id,
            title: item.title,
            description: seoDescription
          })
        }

        results.push({
          mediaId: item.id,
          title: item.title,
          originalTitle: item.title,
          seoDescription,
          category: item.category,
          type: item.type
        })
      }

      await this.logInfo('SEO descriptions generated', { 
        executionId, 
        count: results.length 
      })
      
      return {
        generated: results.length,
        items: results
      }

    } catch (error) {
      await this.logError('SEO description generation failed', error, { executionId })
      throw new Error(`SEO description generation failed: ${error.message}`)
    }
  }

  /**
   * Generate social media captions for projects
   */
  async generateSocialCaptions(options = {}, executionId) {
    await this.logInfo('Generating social media captions', { executionId, options })

    try {
      // Get recent projects or media
      const projects = await prisma.project.findMany({
        include: {
          user: {
            select: { name: true }
          }
        },
        where: {
          status: 'completed'
        },
        orderBy: {
          updatedAt: 'desc'
        },
        take: options.limit || 5
      })

      const captions = []

      for (const project of projects) {
        const caption = this.createSocialCaption(project)
        
        captions.push({
          projectId: project.id,
          title: project.title,
          clientName: project.user?.name || 'Anonymous',
          caption,
          hashtags: this.generateHashtags(project),
          platforms: {
            instagram: this.adaptForInstagram(caption),
            facebook: this.adaptForFacebook(caption),
            twitter: this.adaptForTwitter(caption)
          }
        })
      }

      await this.logInfo('Social captions generated', { 
        executionId, 
        count: captions.length 
      })
      
      return {
        generated: captions.length,
        captions
      }

    } catch (error) {
      await this.logError('Social caption generation failed', error, { executionId })
      throw new Error(`Social caption generation failed: ${error.message}`)
    }
  }

  /**
   * Generate email templates for follow-ups
   */
  async generateEmailTemplates(options = {}, executionId) {
    await this.logInfo('Generating email templates', { executionId, options })

    try {
      const templateTypes = options.types || [
        'quote_follow_up',
        'project_completion',
        'payment_reminder',
        'thank_you'
      ]

      const templates = templateTypes.map(type => ({
        type,
        subject: this.generateEmailSubject(type),
        htmlContent: this.generateEmailHTML(type),
        textContent: this.generateEmailText(type),
        variables: this.getEmailVariables(type)
      }))

      await this.logInfo('Email templates generated', { 
        executionId, 
        count: templates.length 
      })
      
      return {
        generated: templates.length,
        templates
      }

    } catch (error) {
      await this.logError('Email template generation failed', error, { executionId })
      throw new Error(`Email template generation failed: ${error.message}`)
    }
  }

  /**
   * Generate professional quote summaries
   */
  async generateQuoteSummaries(options = {}, executionId) {
    await this.logInfo('Generating quote summaries', { executionId, options })

    try {
      // Get recent quotes
      const quotes = await prisma.weddingQuote.findMany({
        include: {
          package: true,
          venue: true,
          user: { select: { name: true, email: true } },
          quoteAddons: {
            include: { addon: true }
          }
        },
        where: {
          status: options.status || 'pending'
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: options.limit || 5
      })

      const summaries = quotes.map(quote => ({
        quoteId: quote.id,
        clientName: quote.user?.name || 'Anonymous',
        summary: this.createQuoteSummary(quote),
        htmlSummary: this.createQuoteHTMLSummary(quote),
        totalPrice: quote.totalPrice,
        formattedPrice: `$${(quote.totalPrice / 100).toLocaleString()}`,
        eventDate: quote.eventDate,
        packageName: quote.package?.name,
        venueName: quote.venueName || quote.venue?.name
      }))

      await this.logInfo('Quote summaries generated', { 
        executionId, 
        count: summaries.length 
      })
      
      return {
        generated: summaries.length,
        summaries
      }

    } catch (error) {
      await this.logError('Quote summary generation failed', error, { executionId })
      throw new Error(`Quote summary generation failed: ${error.message}`)
    }
  }

  /**
   * Generate blog posts about recent projects
   */
  async generateBlogPosts(options = {}, executionId) {
    await this.logInfo('Generating blog posts', { executionId, options })

    try {
      // Get completed projects for blog content
      const projects = await prisma.project.findMany({
        include: {
          user: { select: { name: true } }
        },
        where: {
          status: 'completed',
          updatedAt: {
            gte: new Date(Date.now() - (options.daysSince || 30) * 24 * 60 * 60 * 1000)
          }
        },
        orderBy: {
          updatedAt: 'desc'
        },
        take: options.limit || 3
      })

      const blogPosts = projects.map(project => ({
        projectId: project.id,
        title: this.generateBlogTitle(project),
        content: this.generateBlogContent(project),
        excerpt: this.generateBlogExcerpt(project),
        seoTitle: this.generateBlogSEOTitle(project),
        metaDescription: this.generateBlogMetaDescription(project),
        tags: this.generateBlogTags(project),
        slug: this.generateBlogSlug(project)
      }))

      await this.logInfo('Blog posts generated', { 
        executionId, 
        count: blogPosts.length 
      })
      
      return {
        generated: blogPosts.length,
        posts: blogPosts
      }

    } catch (error) {
      await this.logError('Blog post generation failed', error, { executionId })
      throw new Error(`Blog post generation failed: ${error.message}`)
    }
  }

  // Content creation helper methods

  createSEODescription(mediaItem) {
    const category = mediaItem.category
    const title = mediaItem.title
    
    const templates = {
      weddings: `Professional wedding videography: ${title}. Expert wedding video production in Lexington, Kentucky. Capturing your special day with cinematic quality and attention to detail.`,
      commercial: `Professional commercial video production: ${title}. High-quality business videos in Lexington, KY. Elevate your brand with expert videography services.`,
      portfolio: `BV Studios portfolio showcase: ${title}. Professional video production examples from our Lexington-based team. Quality videography for weddings and businesses.`
    }
    
    return templates[category] || `Professional video production: ${title} by BV Studios, Lexington Kentucky's premier videography team.`
  }

  createSocialCaption(project) {
    const templates = [
      `Just wrapped up filming for ${project.title}! ✨ Another amazing project in the books. What a journey capturing this story! 🎥`,
      `Thrilled to share the completed ${project.title} project! 🎬 The passion and dedication that went into this production shows in every frame.`,
      `Project complete! ${project.title} was an incredible experience to film. Thank you for trusting us with your vision! 📹`
    ]
    
    return templates[Math.floor(Math.random() * templates.length)]
  }

  generateHashtags(project) {
    const baseHashtags = ['#BVStudios', '#LexingtonKY', '#ProfessionalVideo', '#VideoProduction']
    const projectHashtags = project.title.toLowerCase().includes('wedding') 
      ? ['#WeddingVideography', '#WeddingFilm', '#LoveStory']
      : ['#CommercialVideo', '#BusinessVideo', '#BrandStory']
    
    return [...baseHashtags, ...projectHashtags]
  }

  adaptForInstagram(caption) {
    return caption + '\n\n#BVStudios #LexingtonKY #VideoProduction #ProfessionalVideography'
  }

  adaptForFacebook(caption) {
    return caption + '\n\nProud to serve the Lexington, Kentucky community with professional video production services.'
  }

  adaptForTwitter(caption) {
    return caption.length > 200 ? caption.substring(0, 200) + '...' : caption
  }

  generateEmailSubject(type) {
    const subjects = {
      quote_follow_up: 'Following up on your video production quote',
      project_completion: 'Your video project is complete! 🎥',
      payment_reminder: 'Friendly payment reminder - BV Studios',
      thank_you: 'Thank you for choosing BV Studios!'
    }
    
    return subjects[type] || 'Update from BV Studios'
  }

  generateEmailHTML(type) {
    // Simplified HTML templates
    const templates = {
      quote_follow_up: `
        <h2>Hi {{client_name}},</h2>
        <p>I hope this email finds you well! I wanted to follow up on the video production quote we provided for {{project_name}}.</p>
        <p>We're excited about the possibility of working with you and bringing your vision to life.</p>
        <p>Please let me know if you have any questions or if you'd like to schedule a consultation.</p>
        <p>Best regards,<br>The BV Studios Team</p>
      `,
      project_completion: `
        <h2>Your Project is Complete!</h2>
        <p>Hi {{client_name}},</p>
        <p>We're thrilled to let you know that {{project_name}} is now complete!</p>
        <p>You can download your files using the link we've provided separately.</p>
        <p>Thank you for choosing BV Studios for your video production needs.</p>
      `
    }
    
    return templates[type] || '<p>Update from BV Studios</p>'
  }

  generateEmailText(type) {
    // Plain text versions
    const templates = {
      quote_follow_up: `Hi {{client_name}},\n\nI hope this email finds you well! I wanted to follow up on the video production quote we provided for {{project_name}}.\n\nWe're excited about the possibility of working with you and bringing your vision to life.\n\nPlease let me know if you have any questions or if you'd like to schedule a consultation.\n\nBest regards,\nThe BV Studios Team`,
      project_completion: `Your Project is Complete!\n\nHi {{client_name}},\n\nWe're thrilled to let you know that {{project_name}} is now complete!\n\nYou can download your files using the link we've provided separately.\n\nThank you for choosing BV Studios for your video production needs.`
    }
    
    return templates[type] || 'Update from BV Studios'
  }

  getEmailVariables(type) {
    const variables = {
      quote_follow_up: ['client_name', 'project_name', 'quote_amount', 'quote_date'],
      project_completion: ['client_name', 'project_name', 'download_link'],
      payment_reminder: ['client_name', 'amount_due', 'due_date', 'invoice_number'],
      thank_you: ['client_name', 'project_name', 'completion_date']
    }
    
    return variables[type] || ['client_name']
  }

  createQuoteSummary(quote) {
    let summary = `Wedding Video Production Quote\n\n`
    summary += `Client: ${quote.user?.name || 'Anonymous'}\n`
    summary += `Event Date: ${quote.eventDate.toLocaleDateString()}\n`
    summary += `Package: ${quote.package?.name}\n`
    
    if (quote.venueName || quote.venue?.name) {
      summary += `Venue: ${quote.venueName || quote.venue.name}\n`
    }
    
    if (quote.guestCount) {
      summary += `Guest Count: ${quote.guestCount}\n`
    }
    
    summary += `\nTotal Investment: $${(quote.totalPrice / 100).toLocaleString()}\n`
    
    if (quote.quoteAddons?.length > 0) {
      summary += `\nAdd-ons:\n`
      quote.quoteAddons.forEach(addon => {
        summary += `- ${addon.addon.name}\n`
      })
    }
    
    return summary
  }

  createQuoteHTMLSummary(quote) {
    // HTML version of quote summary
    return `<div class="quote-summary">
      <h3>Wedding Video Production Quote</h3>
      <p><strong>Client:</strong> ${quote.user?.name || 'Anonymous'}</p>
      <p><strong>Event Date:</strong> ${quote.eventDate.toLocaleDateString()}</p>
      <p><strong>Package:</strong> ${quote.package?.name}</p>
      <p><strong>Total Investment:</strong> $${(quote.totalPrice / 100).toLocaleString()}</p>
    </div>`
  }

  generateBlogTitle(project) {
    return `Behind the Scenes: Creating ${project.title}`
  }

  generateBlogContent(project) {
    return `We recently had the pleasure of working on ${project.title}, and what an incredible experience it was!\n\nThis project challenged us to push our creative boundaries and deliver something truly special. From pre-production planning to the final edit, every moment was filled with passion and dedication to the craft.\n\nOur team at BV Studios takes pride in bringing each client's unique vision to life, and ${project.title} was no exception. The attention to detail and collaborative spirit made this project a joy to work on.\n\nStay tuned for more updates from our latest projects!`
  }

  generateBlogExcerpt(project) {
    return `We recently completed ${project.title}, an incredible project that challenged our team to deliver something truly special. Here's the story behind the creation.`
  }

  generateBlogSEOTitle(project) {
    return `${project.title} - Professional Video Production by BV Studios`
  }

  generateBlogMetaDescription(project) {
    return `Behind the scenes look at ${project.title}, a recent video production project by BV Studios in Lexington, Kentucky. Professional videography and storytelling.`
  }

  generateBlogTags(project) {
    return ['video production', 'behind the scenes', 'lexington ky', 'professional videography']
  }

  generateBlogSlug(project) {
    return project.title.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  /**
   * Log bot activity to database
   */
  async logBotActivity(status, data) {
    try {
      await prisma.botLog.create({
        data: {
          botType: this.config.botType,
          action: 'content_generation',
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
      type: z.enum(['seo-descriptions', 'social-captions', 'email-templates', 'quote-summaries', 'blog-posts']),
      options: z.object({
        limit: z.number().min(1).max(50).default(10),
        mediaType: z.enum(['image', 'video']).optional(),
        category: z.string().optional(),
        status: z.string().optional(),
        types: z.array(z.string()).optional(),
        daysSince: z.number().min(1).max(365).default(30)
      }).optional().default({})
    })
  }

  /**
   * Bot health check implementation
   */
  async checkHealth() {
    try {
      // Check database connectivity
      await prisma.media.count()
      await prisma.project.count()
      
      return {
        database: true,
        lastExecution: this.lastExecution,
        isRunning: this.isRunning,
        capabilities: ['seo-descriptions', 'social-captions', 'email-templates', 'quote-summaries', 'blog-posts']
      }
    } catch (error) {
      return {
        database: false,
        error: error.message
      }
    }
  }
}