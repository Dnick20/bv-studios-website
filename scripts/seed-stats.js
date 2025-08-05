// scripts/seed-stats.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Update these values as needed
  const statsData = {
    totalVideos: 150,
    happyClients: 50,
    yearsExperience: 8,
    clientSatisfaction: 100,
    completionRate: 95
  }
  // Upsert: update if exists, else create
  const existing = await prisma.stats.findFirst()
  if (existing) {
    await prisma.stats.update({ where: { id: existing.id }, data: statsData })
    console.log('Stats updated!')
  } else {
    await prisma.stats.create({ data: statsData })
    console.log('Stats created!')
  }
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())