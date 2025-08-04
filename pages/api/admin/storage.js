import { listBackblazeFiles, deleteFromBackblaze, generateDownloadUrl, BUCKETS } from '../../../lib/backblaze'
import jwt from 'jsonwebtoken'

function verifyAdminToken(req) {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.headers['x-admin-token']
  if (!token) {
    return false
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'admin-secret')
    return decoded.role === 'admin'
  } catch (error) {
    return false
  }
}

export default async function handler(req, res) {
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { method } = req

  switch (method) {
    case 'GET':
      try {
        const { bucket, prefix } = req.query
        const targetBucket = bucket || BUCKETS.media
        
        const result = await listBackblazeFiles(targetBucket, prefix || '')
        
        if (result.success) {
          const files = result.files.map(file => ({
            key: file.Key,
            size: file.Size,
            lastModified: file.LastModified,
            url: `https://${targetBucket}.s3.us-west-002.backblazeb2.com/${file.Key}`,
            etag: file.ETag
          }))
          
          res.status(200).json({
            files,
            total: files.length,
            bucket: targetBucket
          })
        } else {
          res.status(500).json({
            error: 'Failed to list files',
            details: result.error
          })
        }
      } catch (error) {
        console.error('Error listing files:', error)
        res.status(500).json({ error: 'Failed to list files' })
      }
      break

    case 'DELETE':
      try {
        const { bucket, key } = req.query
        
        if (!key) {
          return res.status(400).json({ error: 'File key is required' })
        }

        const targetBucket = bucket || BUCKETS.media
        const result = await deleteFromBackblaze(targetBucket, key)
        
        if (result.success) {
          res.status(200).json({
            message: 'File deleted successfully',
            key
          })
        } else {
          res.status(500).json({
            error: 'Failed to delete file',
            details: result.error
          })
        }
      } catch (error) {
        console.error('Error deleting file:', error)
        res.status(500).json({ error: 'Failed to delete file' })
      }
      break

    case 'POST':
      try {
        const { bucket, key, expiresIn = 3600 } = req.body
        
        if (!key) {
          return res.status(400).json({ error: 'File key is required' })
        }

        const targetBucket = bucket || BUCKETS.media
        const result = await generateDownloadUrl(targetBucket, key, expiresIn)
        
        if (result.success) {
          res.status(200).json({
            downloadUrl: result.url,
            key: result.key,
            expiresIn
          })
        } else {
          res.status(500).json({
            error: 'Failed to generate download URL',
            details: result.error
          })
        }
      } catch (error) {
        console.error('Error generating download URL:', error)
        res.status(500).json({ error: 'Failed to generate download URL' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'DELETE', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
} 