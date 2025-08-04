import { getServerSession } from 'next-auth/next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  const session = await getServerSession(req, res)
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.method === 'POST') {
    try {
      const {
        packageId,
        eventDate,
        eventTime,
        venueId,
        venueName,
        guestCount,
        specialRequests,
        addons
      } = req.body

      // Validate required fields
      if (!packageId || !eventDate || !eventTime) {
        return res.status(400).json({ 
          message: 'Package, event date, and time are required' 
        })
      }

      // Get package details to calculate total price
      const packageDetails = await prisma.weddingPackage.findUnique({
        where: { id: packageId }
      })

      if (!packageDetails) {
        return res.status(404).json({ message: 'Package not found' })
      }

      // Calculate total price
      let totalPrice = packageDetails.price

      // Add addon prices if provided
      if (addons && addons.length > 0) {
        const addonDetails = await prisma.weddingAddon.findMany({
          where: {
            id: { in: addons.map(addon => addon.addonId) }
          }
        })

        addons.forEach(addon => {
          const addonDetail = addonDetails.find(a => a.id === addon.addonId)
          if (addonDetail) {
            totalPrice += addonDetail.price
          }
        })
      }

      // Get user by email since session might not have id
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      })

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      // Create the quote
      const quote = await prisma.weddingQuote.create({
        data: {
          userId: user.id,
          packageId,
          eventDate: new Date(eventDate),
          eventTime,
          venueId: venueId || null,
          venueName: venueName || null,
          guestCount: guestCount ? parseInt(guestCount, 10) : null,
          specialRequests: specialRequests || null,
          totalPrice
        }
      })

      // Create quote addons if provided
      if (addons && addons.length > 0) {
        const quoteAddons = addons.map(addon => ({
          quoteId: quote.id,
          addonId: addon.addonId,
          price: addon.price || 0
        }))

        await prisma.quoteAddon.createMany({
          data: quoteAddons
        })
      }

      return res.status(201).json({ 
        message: 'Quote created successfully',
        quote: {
          ...quote,
          totalPriceFormatted: `$${(quote.totalPrice / 100).toLocaleString()}`
        }
      })
    } catch (error) {
      console.error('Create quote error:', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  if (req.method === 'GET') {
    try {
      // Get user by email since session might not have id
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      })

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      const quotes = await prisma.weddingQuote.findMany({
        where: {
          userId: user.id
        },
        include: {
          package: true,
          venue: true,
          quoteAddons: {
            include: {
              addon: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      // Format the response
      const formattedQuotes = quotes.map(quote => ({
        ...quote,
        totalPriceFormatted: `$${(quote.totalPrice / 100).toLocaleString()}`,
        package: {
          ...quote.package,
          priceFormatted: `$${(quote.package.price / 100).toLocaleString()}`
        },
        quoteAddons: quote.quoteAddons.map(qa => ({
          ...qa,
          addon: {
            ...qa.addon,
            priceFormatted: `$${(qa.addon.price / 100).toLocaleString()}`
          }
        }))
      }))

      return res.status(200).json({ quotes: formattedQuotes })
    } catch (error) {
      console.error('Get quotes error:', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
} 