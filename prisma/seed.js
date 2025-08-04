const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding wedding booking system data...')

  // Create Wedding Packages
  const packages = [
    {
      name: 'Basic Wedding Package',
      description: 'Perfect for intimate weddings with essential coverage',
      price: 150000, // $1,500
      duration: 4,
      features: JSON.stringify([
        '4 hours of video coverage',
        'Basic editing and color correction',
        'Digital delivery',
        '1 videographer',
        'Highlight reel (3-5 minutes)',
        'Full ceremony and reception coverage'
      ]),
      sortOrder: 1
    },
    {
      name: 'Premium Wedding Package',
      description: 'Comprehensive coverage for your special day',
      price: 250000, // $2,500
      duration: 8,
      features: JSON.stringify([
        '8 hours of video coverage',
        'Advanced editing and color correction',
        'Digital delivery + USB backup',
        '2 videographers',
        'Highlight reel (5-8 minutes)',
        'Full ceremony and reception coverage',
        'Pre-wedding consultation',
        'Drone footage included'
      ]),
      sortOrder: 2
    },
    {
      name: 'Luxury Wedding Package',
      description: 'Ultimate wedding experience with premium features',
      price: 400000, // $4,000
      duration: 12,
      features: JSON.stringify([
        '12 hours of video coverage',
        'Cinematic editing and color grading',
        'Digital delivery + USB backup + Blu-ray',
        '3 videographers',
        'Highlight reel (8-12 minutes)',
        'Full ceremony and reception coverage',
        'Pre-wedding consultation',
        'Drone footage included',
        'Same-day edit available',
        'Engagement session included',
        'Custom music selection'
      ]),
      sortOrder: 3
    }
  ]

  for (const pkg of packages) {
    await prisma.weddingPackage.create({
      data: pkg
    })
  }

  // Create Wedding Add-ons
  const addons = [
    {
      name: 'Drone Coverage',
      description: 'Aerial footage of your venue and special moments',
      price: 50000, // $500
      category: 'video',
      sortOrder: 1
    },
    {
      name: 'Photo Album',
      description: 'Beautiful printed photo album with your favorite moments',
      price: 30000, // $300
      category: 'photo',
      sortOrder: 2
    },
    {
      name: 'Same-Day Edit',
      description: 'Get your highlight reel ready for the reception',
      price: 75000, // $750
      category: 'service',
      sortOrder: 3
    },
    {
      name: 'Engagement Session',
      description: 'Pre-wedding photo and video session',
      price: 40000, // $400
      category: 'photo',
      sortOrder: 4
    },
    {
      name: 'Rehearsal Dinner Coverage',
      description: 'Coverage of your rehearsal dinner',
      price: 35000, // $350
      category: 'video',
      sortOrder: 5
    },
    {
      name: 'Custom Music Selection',
      description: 'Personalized music for your highlight reel',
      price: 25000, // $250
      category: 'service',
      sortOrder: 6
    },
    {
      name: 'Extended Coverage',
      description: 'Additional hours of coverage',
      price: 20000, // $200 per hour
      category: 'video',
      sortOrder: 7
    },
    {
      name: 'Raw Footage',
      description: 'All raw footage from your wedding day',
      price: 15000, // $150
      category: 'video',
      sortOrder: 8
    }
  ]

  for (const addon of addons) {
    await prisma.weddingAddon.create({
      data: addon
    })
  }

  // Create Venues
  const venues = [
    {
      name: 'The Grand Ballroom',
      address: '123 Main Street',
      city: 'Nashville',
      state: 'TN',
      zipCode: '37201',
      phone: '(615) 555-0123',
      website: 'https://grandballroom.com',
      description: 'Elegant ballroom perfect for large weddings'
    },
    {
      name: 'Riverside Gardens',
      address: '456 River Road',
      city: 'Nashville',
      state: 'TN',
      zipCode: '37202',
      phone: '(615) 555-0456',
      website: 'https://riversidegardens.com',
      description: 'Beautiful outdoor venue with garden settings'
    },
    {
      name: 'Historic Church',
      address: '789 Church Street',
      city: 'Nashville',
      state: 'TN',
      zipCode: '37203',
      phone: '(615) 555-0789',
      website: 'https://historicchurch.com',
      description: 'Traditional church with stunning architecture'
    },
    {
      name: 'Modern Loft',
      address: '321 Industrial Blvd',
      city: 'Nashville',
      state: 'TN',
      zipCode: '37204',
      phone: '(615) 555-0321',
      website: 'https://modernloft.com',
      description: 'Contemporary space with urban charm'
    },
    {
      name: 'Country Club',
      address: '654 Country Club Drive',
      city: 'Nashville',
      state: 'TN',
      zipCode: '37205',
      phone: '(615) 555-0654',
      website: 'https://countryclub.com',
      description: 'Upscale venue with golf course views'
    }
  ]

  for (const venue of venues) {
    await prisma.venue.create({
      data: venue
    })
  }

  console.log('✅ Wedding booking system data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 