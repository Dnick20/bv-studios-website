import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Backblaze B2 Configuration
const BACKBLAZE_CONFIG = {
  endpoint:
    process.env.BACKBLAZE_ENDPOINT || 'https://s3.us-west-002.backblazeb2.com',
  region: process.env.BACKBLAZE_REGION || 'us-west-002',
  credentials: {
    accessKeyId: process.env.BACKBLAZE_KEY_ID,
    secretAccessKey: process.env.BACKBLAZE_APPLICATION_KEY,
  },
}

// Initialize S3 client for Backblaze B2
const s3Client = new S3Client(BACKBLAZE_CONFIG)

// Bucket names for different purposes
const BUCKETS = {
  database: process.env.BACKBLAZE_DATABASE_BUCKET || 'bv-studios-database',
  media: process.env.BACKBLAZE_MEDIA_BUCKET || 'bv-studios-media',
  backups: process.env.BACKBLAZE_BACKUPS_BUCKET || 'bv-studios-backups',
  uploads: process.env.BACKBLAZE_UPLOADS_BUCKET || 'bv-studios-uploads',
}

/**
 * Upload file to Backblaze B2
 */
export const uploadToBackblaze = async (
  bucket,
  key,
  file,
  contentType = null
) => {
  try {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file,
      ContentType: contentType,
      ACL: 'public-read',
    })

    const result = await s3Client.send(command)
    return {
      success: true,
      url: `https://${bucket}.s3.us-west-002.backblazeb2.com/${key}`,
      key,
      etag: result.ETag,
    }
  } catch (error) {
    console.error('Error uploading to Backblaze:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Get file from Backblaze B2
 */
export const getFromBackblaze = async (bucket, key) => {
  try {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })

    const result = await s3Client.send(command)
    return {
      success: true,
      data: result.Body,
      contentType: result.ContentType,
      lastModified: result.LastModified,
    }
  } catch (error) {
    console.error('Error getting from Backblaze:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Delete file from Backblaze B2
 */
export const deleteFromBackblaze = async (bucket, key) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })

    await s3Client.send(command)
    return { success: true }
  } catch (error) {
    console.error('Error deleting from Backblaze:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * List files in Backblaze B2 bucket
 */
export const listBackblazeFiles = async (bucket, prefix = '') => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
    })

    const result = await s3Client.send(command)
    return {
      success: true,
      files: result.Contents || [],
    }
  } catch (error) {
    console.error('Error listing Backblaze files:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Generate presigned URL for upload
 */
export const generateUploadUrl = async (
  bucket,
  key,
  contentType,
  expiresIn = 3600
) => {
  try {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    })

    const url = await getSignedUrl(s3Client, command, { expiresIn })
    return {
      success: true,
      url,
      key,
    }
  } catch (error) {
    console.error('Error generating upload URL:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Generate presigned URL for download
 */
export const generateDownloadUrl = async (bucket, key, expiresIn = 3600) => {
  try {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })

    const url = await getSignedUrl(s3Client, command, { expiresIn })
    return {
      success: true,
      url,
      key,
    }
  } catch (error) {
    console.error('Error generating download URL:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Backup database to Backblaze
 */
export const backupDatabaseToBackblaze = async () => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const key = `backups/database-${timestamp}.db`

    // For now, we'll create a backup of the SQLite database
    // In production, you might want to use a different approach
    const fs = require('fs')
    const path = require('path')

    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    const dbBuffer = fs.readFileSync(dbPath)

    const result = await uploadToBackblaze(
      BUCKETS.backups,
      key,
      dbBuffer,
      'application/x-sqlite3'
    )

    return result
  } catch (error) {
    console.error('Error backing up database:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Upload media file to Backblaze
 */
export const uploadMediaToBackblaze = async (file, category, filename) => {
  try {
    const key = `media/${category}/${filename}`
    const body = file.stream || file
    const contentType = file.type || 'application/octet-stream'
    const result = await uploadToBackblaze(
      BUCKETS.media,
      key,
      body,
      contentType
    )

    return result
  } catch (error) {
    console.error('Error uploading media:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

export { BUCKETS, s3Client }
