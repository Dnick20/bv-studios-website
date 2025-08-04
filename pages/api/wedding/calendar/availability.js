import { getServerSession } from 'next-auth/next'
import { prisma } from '../../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { date, packageId } = req.query

    // Get package duration
    const packageInfo = await prisma.weddingPackage.findUnique({
      where: { id: packageId },
      select: { duration: true }
    })

    if (!packageInfo) {
      return res.status(404).json({ message: 'Package not found' })
    }

    // Check existing bookings for the date
    const existingBookings = await prisma.weddingEvent.findMany({
      where: {
        eventDate: date,
        status: {
          in: ['confirmed', 'pending']
        }
      },
      include: {
        package: {
          select: { duration: true }
        }
      }
    })

    // Define available time slots
    const availableTimeSlots = [
      '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
    ]

    // Check conflicts for each time slot
    const conflicts = []
    const availableSlots = []

    for (const timeSlot of availableTimeSlots) {
      const slotStart = new Date(`${date}T${timeSlot}:00`)
      const slotEnd = new Date(slotStart.getTime() + (packageInfo.duration * 60 * 60 * 1000))

      let hasConflict = false

      for (const booking of existingBookings) {
        const bookingStart = new Date(`${date}T${booking.eventTime}:00`)
        const bookingEnd = new Date(bookingStart.getTime() + (booking.package.duration * 60 * 60 * 1000))

        // Check for overlap
        if (slotStart < bookingEnd && slotEnd > bookingStart) {
          hasConflict = true
          conflicts.push({
            time: timeSlot,
            reason: 'Existing booking',
            bookingId: booking.id
          })
          break
        }
      }

      if (!hasConflict) {
        availableSlots.push(timeSlot)
      }
    }

    // Get venue availability for the date
    const venues = await prisma.venue.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        state: true
      }
    })

    res.status(200).json({
      date: date,
      packageDuration: packageInfo.duration,
      availableTimeSlots: availableSlots,
      conflicts: conflicts,
      venues: venues,
      totalAvailableSlots: availableSlots.length,
      totalConflicts: conflicts.length
    })

  } catch (error) {
    console.error('Availability check error:', error)
    res.status(500).json({ message: 'Error checking availability' })
  }
} 