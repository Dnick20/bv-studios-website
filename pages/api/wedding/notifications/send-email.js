import { getServerSession } from 'next-auth/next'
import { prisma } from '../../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const session = await getServerSession(req, res)
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const { quoteId, emailType, recipientEmail } = req.body

    // Fetch quote details
    const quote = await prisma.weddingQuote.findUnique({
      where: { id: quoteId },
      include: {
        package: true,
        addons: {
          include: {
            addon: true
          }
        },
        user: true,
        venue: true
      }
    })

    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' })
    }

    // Email templates
    const emailTemplates = {
      quoteSubmitted: {
        subject: 'Your Wedding Quote Request - BV Studios',
        template: `
          <h2>Thank you for your quote request!</h2>
          <p>Dear ${quote.user.name},</p>
          <p>We've received your wedding videography quote request and are excited to work with you!</p>
          
          <h3>Quote Details:</h3>
          <ul>
            <li><strong>Package:</strong> ${quote.package.name}</li>
            <li><strong>Event Date:</strong> ${new Date(quote.eventDate).toLocaleDateString()}</li>
            <li><strong>Event Time:</strong> ${quote.eventTime}</li>
            <li><strong>Total Price:</strong> $${(quote.totalPrice / 100).toLocaleString()}</li>
          </ul>
          
          ${quote.addons.length > 0 ? `
          <h3>Selected Addons:</h3>
          <ul>
            ${quote.addons.map(addon => `<li>${addon.addon.name} - $${(addon.price / 100).toLocaleString()}</li>`).join('')}
          </ul>
          ` : ''}
          
          <p>We'll review your request and get back to you within 24 hours with our availability and next steps.</p>
          
          <p>Best regards,<br>BV Studios Team</p>
        `
      },
      quoteApproved: {
        subject: 'Your Quote Has Been Approved! - BV Studios',
        template: `
          <h2>Great news! Your quote has been approved!</h2>
          <p>Dear ${quote.user.name},</p>
          <p>We're excited to confirm your wedding videography booking!</p>
          
          <h3>Booking Details:</h3>
          <ul>
            <li><strong>Package:</strong> ${quote.package.name}</li>
            <li><strong>Event Date:</strong> ${new Date(quote.eventDate).toLocaleDateString()}</li>
            <li><strong>Event Time:</strong> ${quote.eventTime}</li>
            <li><strong>Total Price:</strong> $${(quote.totalPrice / 100).toLocaleString()}</li>
          </ul>
          
          <p><strong>Next Steps:</strong></p>
          <ol>
            <li>Complete your payment (deposit or full payment)</li>
            <li>We'll send you a detailed timeline</li>
            <li>Schedule your pre-wedding consultation</li>
          </ol>
          
          <p>We can't wait to capture your special day!</p>
          
          <p>Best regards,<br>BV Studios Team</p>
        `
      },
      paymentReceived: {
        subject: 'Payment Received - Wedding Booking Confirmed - BV Studios',
        template: `
          <h2>Payment received! Your booking is confirmed!</h2>
          <p>Dear ${quote.user.name},</p>
          <p>Thank you for your payment. Your wedding videography booking is now confirmed!</p>
          
          <h3>Booking Confirmation:</h3>
          <ul>
            <li><strong>Package:</strong> ${quote.package.name}</li>
            <li><strong>Event Date:</strong> ${new Date(quote.eventDate).toLocaleDateString()}</li>
            <li><strong>Event Time:</strong> ${quote.eventTime}</li>
            <li><strong>Venue:</strong> ${quote.venue?.name || 'TBD'}</li>
          </ul>
          
          <p><strong>What's Next:</strong></p>
          <ol>
            <li>We'll contact you within 48 hours to schedule your consultation</li>
            <li>You'll receive a detailed timeline and shot list</li>
            <li>We'll confirm final details 1 week before your wedding</li>
          </ol>
          
          <p>We're honored to be part of your special day!</p>
          
          <p>Best regards,<br>BV Studios Team</p>
        `
      }
    }

    const template = emailTemplates[emailType]
    if (!template) {
      return res.status(400).json({ message: 'Invalid email type' })
    }

    // In a real implementation, you would use an email service like SendGrid, Mailgun, etc.
    // For now, we'll simulate the email sending
    const emailData = {
      to: recipientEmail || quote.user.email,
      subject: template.subject,
      html: template.template,
      from: 'noreply@bvstudios.com'
    }

    // Log the email (in production, send via email service)
    console.log('Email would be sent:', emailData)

    // Update quote with email sent status
    await prisma.weddingQuote.update({
      where: { id: quoteId },
      data: {
        lastEmailSent: new Date(),
        emailType: emailType
      }
    })

    res.status(200).json({
      message: 'Email sent successfully',
      emailData: emailData
    })

  } catch (error) {
    console.error('Email sending error:', error)
    res.status(500).json({ message: 'Error sending email' })
  }
} 