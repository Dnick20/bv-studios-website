#!/usr/bin/env node
/*
  Migrates legacy File.url entries that point to /uploads/... on local disk
  to Backblaze B2. It uploads the file and updates the DB url field.

  Usage:
    node scripts/migrate-local-files-to-b2.js
*/

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { prisma } from '../lib/prisma.js'
import { uploadToBackblaze, BUCKETS } from '../lib/backblaze.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function migrate() {
  const legacyFiles = await prisma.file.findMany({
    where: { url: { startsWith: '/uploads/' } },
  })

  if (legacyFiles.length === 0) {
    console.log('No legacy local files found.')
    return
  }

  console.log(`Found ${legacyFiles.length} legacy files. Starting migration...`)

  let migrated = 0
  for (const f of legacyFiles) {
    const diskPath = path.join(process.cwd(), 'public', f.url)
    if (!fs.existsSync(diskPath)) {
      console.warn(`Skip (missing on disk): ${diskPath}`)
      continue
    }

    const ext = path.extname(f.name).toLowerCase()
    const category =
      f.type === 'image'
        ? 'images'
        : f.type === 'video'
        ? 'videos'
        : 'documents'
    const key = `media/${category}/${f.name}`

    try {
      const stream = fs.createReadStream(diskPath)
      const contentType = guessContentType(ext)
      const result = await uploadToBackblaze(
        BUCKETS.media,
        key,
        stream,
        contentType
      )
      if (!result.success) {
        console.error(`Upload failed for ${f.id}: ${result.error}`)
        continue
      }

      await prisma.file.update({
        where: { id: f.id },
        data: { url: result.url },
      })

      migrated++
      console.log(`Migrated ${f.id} -> ${result.url}`)
    } catch (err) {
      console.error(`Error migrating ${f.id}:`, err.message)
    }
  }

  console.log(`Migration complete. Migrated ${migrated}/${legacyFiles.length}.`)
}

function guessContentType(ext) {
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
  if (ext === '.png') return 'image/png'
  if (ext === '.gif') return 'image/gif'
  if (ext === '.webp') return 'image/webp'
  if (ext === '.mp4') return 'video/mp4'
  if (ext === '.avi') return 'video/x-msvideo'
  if (ext === '.mov') return 'video/quicktime'
  if (ext === '.wmv') return 'video/x-ms-wmv'
  if (ext === '.pdf') return 'application/pdf'
  if (ext === '.doc' || ext === '.docx') return 'application/msword'
  if (ext === '.txt') return 'text/plain'
  return 'application/octet-stream'
}

migrate()
  .catch((err) => {
    console.error('Migration failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
