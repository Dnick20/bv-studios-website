import { BaseBot } from '../core/BaseBot.js'
import { prisma } from '../../prisma.js'

/**
 * WeddingDataBot
 * - Seeds/updates Wedding Packages, Addons, and Venues in the database
 * - Intended to keep content in sync with the booking UI
 */
export class WeddingDataBot extends BaseBot {
  constructor(config = {}) {
    super({ botType: 'wedding-data', ...config })
  }

  async process(input) {
    const action = input?.action || 'sync-defaults'
    switch (action) {
      case 'sync-defaults':
        return await this.syncDefaults()
      default:
        throw new Error(`Unknown action for WeddingDataBot: ${action}`)
    }
  }

  async syncDefaults() {
    // Default packages (prices in cents; features as JSON string)
    const defaultPackages = [
      {
        id: 'pkg_basic',
        name: 'Standard Wedding Package',
        description: 'Perfect for intimate weddings and elopements',
        price: 150000,
        duration: 4,
        features: JSON.stringify([
          '4 hours of coverage',
          'Ceremony and reception highlights',
          'Basic editing and color correction',
          'Digital delivery',
          '30-day revision period',
        ]),
        isActive: true,
        sortOrder: 1,
      },
      {
        id: 'pkg_premium',
        name: 'Premium Wedding Package',
        description: 'Comprehensive coverage for your special day',
        price: 250000,
        duration: 8,
        features: JSON.stringify([
          '8 hours of coverage',
          'Full ceremony and reception',
          'Getting ready footage',
          'Advanced editing and color grading',
          'Multiple camera angles',
          'Drone footage (if applicable)',
          'Digital delivery + USB backup',
          '60-day revision period',
        ]),
        isActive: true,
        sortOrder: 2,
      },
      {
        id: 'pkg_luxury',
        name: 'Luxury Wedding Package',
        description: 'Ultimate wedding video experience',
        price: 400000,
        duration: 12,
        features: JSON.stringify([
          '12 hours of coverage',
          'Multi-day coverage available',
          'Cinematic storytelling approach',
          'Professional color grading',
          'Multiple camera setup',
          'Drone and gimbal footage',
          'Wedding trailer (30-60 seconds)',
          'Full feature film (60-90 minutes)',
          'Digital delivery + USB + Blu-ray',
          '90-day revision period',
          'Consultation and planning session',
        ]),
        isActive: true,
        sortOrder: 3,
      },
    ]

    const defaultAddons = [
      {
        id: 'add_drone',
        name: 'Drone Coverage',
        category: 'aerial',
        price: 30000,
      },
      {
        id: 'add_slideshow',
        name: 'Photo Slideshow',
        category: 'media',
        price: 15000,
      },
      {
        id: 'add_same_day',
        name: 'Same Day Edit',
        category: 'rush',
        price: 50000,
      },
      {
        id: 'add_hours',
        name: 'Additional Hours',
        category: 'coverage',
        price: 20000,
      },
      {
        id: 'add_trailer',
        name: 'Wedding Trailer',
        category: 'media',
        price: 25000,
      },
      {
        id: 'add_messages',
        name: 'Guest Messages',
        category: 'interactive',
        price: 10000,
      },
    ]

    const defaultVenues = [
      {
        name: 'Kentucky Horse Park',
        location: 'Lexington, KY',
        address: '4089 Iron Works Pkwy',
        city: 'Lexington',
        state: 'KY',
        zipCode: '40511',
      },
      {
        name: 'Gratz Park Inn',
        location: 'Lexington, KY',
        address: '120 W 2nd St',
        city: 'Lexington',
        state: 'KY',
        zipCode: '40507',
      },
      {
        name: 'Keeneland',
        location: 'Lexington, KY',
        address: '4201 Versailles Rd',
        city: 'Lexington',
        state: 'KY',
        zipCode: '40510',
      },
      {
        name: 'The Barn at Shaker Village',
        location: 'Harrodsburg, KY',
        address: '3501 Lexington Rd',
        city: 'Harrodsburg',
        state: 'KY',
        zipCode: '40330',
      },
    ]

    const results = {
      packagesUpserted: 0,
      addonsUpserted: 0,
      venuesUpserted: 0,
    }

    // Upsert packages
    for (const p of defaultPackages) {
      await prisma.weddingPackage.upsert({
        where: { id: p.id },
        update: { ...p },
        create: { ...p },
      })
      results.packagesUpserted++
    }

    // Upsert addons
    for (const a of defaultAddons) {
      await prisma.weddingAddon.upsert({
        where: { id: a.id },
        update: { ...a, isActive: true, sortOrder: 0 },
        create: { ...a, isActive: true, sortOrder: 0 },
      })
      results.addonsUpserted++
    }

    // Upsert venues (ensure minimal required fields)
    for (const v of defaultVenues) {
      await prisma.venue.upsert({
        where: { name: v.name },
        update: {
          address: v.address || '',
          city: v.city || '',
          state: v.state || '',
          zipCode: v.zipCode || '',
          isActive: true,
        },
        create: {
          name: v.name,
          address: v.address || '',
          city: v.city || '',
          state: v.state || '',
          zipCode: v.zipCode || '',
          isActive: true,
        },
      })
      results.venuesUpserted++
    }

    await this.logInfo('Wedding data sync completed', results)
    return { success: true, ...results }
  }
}
