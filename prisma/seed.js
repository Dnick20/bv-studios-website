import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding wedding booking system data...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('dominic20', 10)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin' },
    update: {
      password: hashedPassword,
      role: 'admin',
    },
    create: {
      email: 'admin',
      name: 'Admin',
      password: hashedPassword,
      role: 'admin',
    },
  })
  console.log('✅ Admin user created:', adminUser.email)

  // Create Wedding Packages
  const packages = [
    {
      name: 'Silver Collection',
      description: 'Perfect for intimate celebrations',
      price: 220000, // $2,200
      duration: 4,
      features: JSON.stringify([
        '4 hours of coverage',
        'Short Film',
        'Digital Delivery',
        '1 videographer',
        'Basic editing and color correction',
        'Full ceremony and reception coverage',
      ]),
      sortOrder: 1,
    },
    {
      name: 'Gold Collection',
      description: 'Our most popular package',
      price: 310000, // $3,100
      duration: 6,
      features: JSON.stringify([
        '6 hours of coverage',
        'Short Film',
        'Ceremony',
        'Instagram Trailer',
        'Digital Delivery',
        '2 videographers',
        'Advanced editing and color correction',
        'Pre-wedding consultation',
      ]),
      sortOrder: 2,
    },
    {
      name: 'Diamond Collection',
      description: 'Complete wedding story',
      price: 450000, // $4,500
      duration: 8,
      features: JSON.stringify([
        '8 hours of coverage',
        'Short Film',
        'Ceremony and Reception Film',
        'Drone Coverage',
        'Instagram Trailer',
        'Digital Delivery',
        '3 videographers',
        'Cinematic editing and color grading',
        'Pre-wedding consultation',
        'Same-day edit available',
      ]),
      sortOrder: 3,
    },
  ]

  for (const pkg of packages) {
    await prisma.weddingPackage.create({
      data: pkg,
    })
  }

  // Create Wedding Add-ons
  const addons = [
    {
      name: 'Ceremony Film',
      description:
        'A 15-20 Minute film of your ceremony with clean recorded audio, color grading, and 2 camera angles',
      price: 65000, // $650
      category: 'video',
      sortOrder: 1,
    },
    {
      name: 'Engagement Film',
      description:
        'A short creative aside from your wedding film that accompanies your wedding film',
      price: 65000, // $650
      category: 'video',
      sortOrder: 2,
    },
    {
      name: 'Additional Hours',
      description:
        "Have a long party? Get additional hours so you don't miss a thing!",
      price: 26000, // $260 per hour
      category: 'video',
      sortOrder: 3,
    },
    {
      name: 'Drone Footage',
      description:
        'Aerial coverage to capture your venue and special moments from above',
      price: 65000, // $650
      category: 'video',
      sortOrder: 4,
    },
  ]

  for (const addon of addons) {
    console.log('Creating addon:', addon.name)
    await prisma.weddingAddon.create({
      data: addon,
    })
  }

  // Create Venues
  const venues = [
    {
      name: 'The Grand Ballroom',
      address: '123 Main Street',
      city: 'Lexington',
      state: 'KY',
      zipCode: '40507',
      phone: '(859) 555-0123',
      website: 'https://grandballroom.com',
      description: 'Elegant ballroom perfect for large weddings',
    },
    {
      name: 'Riverside Gardens',
      address: '456 River Road',
      city: 'Lexington',
      state: 'KY',
      zipCode: '40502',
      phone: '(859) 555-0456',
      website: 'https://riversidegardens.com',
      description: 'Beautiful outdoor venue with garden settings',
    },
    {
      name: 'Historic Church',
      address: '789 Church Street',
      city: 'Lexington',
      state: 'KY',
      zipCode: '40503',
      phone: '(859) 555-0789',
      website: 'https://historicchurch.com',
      description: 'Traditional church with stunning architecture',
    },
    {
      name: 'Modern Loft',
      address: '321 Industrial Blvd',
      city: 'Lexington',
      state: 'KY',
      zipCode: '40504',
      phone: '(859) 555-0321',
      website: 'https://modernloft.com',
      description: 'Contemporary space with urban charm',
    },
    {
      name: 'Country Club',
      address: '654 Country Club Drive',
      city: 'Lexington',
      state: 'KY',
      zipCode: '40505',
      phone: '(859) 555-0654',
      website: 'https://countryclub.com',
      description: 'Upscale venue with golf course views',
    },
  ]

  for (const venue of venues) {
    await prisma.venue.create({
      data: venue,
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
