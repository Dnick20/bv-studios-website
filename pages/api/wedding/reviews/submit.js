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
    const { eventId, rating, comment, anonymous } = req.body

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' })
    }

    // Check if user has a completed wedding event
    const event = await prisma.weddingEvent.findFirst({
      where: {
        id: eventId,
        userId: session.user.id,
        status: 'completed'
      },
      include: {
        package: true,
        venue: true
      }
    })

    if (!event) {
      return res.status(404).json({ message: 'Completed wedding event not found' })
    }

    // Check if user already submitted a review for this event
    const existingReview = await prisma.review.findFirst({
      where: {
        eventId: eventId,
        userId: session.user.id
      }
    })

    if (existingReview) {
      return res.status(400).json({ message: 'You have already submitted a review for this event' })
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        eventId: eventId,
        rating: rating,
        comment: comment,
        isAnonymous: anonymous || false,
        status: 'pending', // Requires admin approval
        packageId: event.packageId,
        venueId: event.venueId
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        event: {
          include: {
            package: true,
            venue: true
          }
        }
      }
    })

    res.status(201).json({
      message: 'Review submitted successfully',
      review: {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        isAnonymous: review.isAnonymous,
        status: review.status,
        createdAt: review.createdAt
      }
    })

  } catch (error) {
    console.error('Review submission error:', error)
    res.status(500).json({ message: 'Error submitting review' })
  }
} 