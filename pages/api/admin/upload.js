import { uploadMediaToBackblaze, generateUploadUrl, BUCKETS } from '../../../lib/backblaze'
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
    case 'POST':
      try {
        const { category, filename, contentType } = req.body
        
        if (!category || !filename) {
          return res.status(400).json({ error: 'Category and filename are required' })
        }

        // Generate presigned URL for direct upload
        const key = `media/${category}/${filename}`
        const result = await generateUploadUrl(
          BUCKETS.media,
          key,
          contentType || 'application/octet-stream',
          3600 // 1 hour
        )
        
        if (result.success) {
          res.status(200).json({
            uploadUrl: result.url,
            key: result.key,
            bucket: BUCKETS.media,
            publicUrl: `https://${BUCKETS.media}.s3.us-west-002.backblazeb2.com/${key}`
          })
        } else {
          res.status(500).json({
            error: 'Failed to generate upload URL',
            details: result.error
          })
        }
      } catch (error) {
        console.error('Error generating upload URL:', error)
        res.status(500).json({ error: 'Failed to generate upload URL' })
      }
      break

    case 'PUT':
      try {
        // Handle direct file upload (for smaller files)
        const { category, filename } = req.query
        const fileBuffer = req.body
        
        if (!category || !filename) {
          return res.status(400).json({ error: 'Category and filename are required' })
        }

        const result = await uploadMediaToBackblaze(
          fileBuffer,
          category,
          filename
        )
        
        if (result.success) {
          res.status(200).json({
            message: 'File uploaded successfully',
            url: result.url,
            key: result.key
          })
        } else {
          res.status(500).json({
            error: 'Failed to upload file',
            details: result.error
          })
        }
      } catch (error) {
        console.error('Error uploading file:', error)
        res.status(500).json({ error: 'Failed to upload file' })
      }
      break

    default:
      res.setHeader('Allow', ['POST', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
} 