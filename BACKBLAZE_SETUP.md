# Backblaze B2 Setup for BV Studios

## Overview
This document outlines the setup process for using Backblaze B2 as the cloud storage solution for BV Studios website.

## Prerequisites
1. Backblaze B2 account
2. AWS SDK for JavaScript v3 (already installed)

## Setup Steps

### 1. Create Backblaze B2 Account
1. Go to [Backblaze B2](https://www.backblaze.com/b2/cloud-storage.html)
2. Sign up for a free account
3. Note your Account ID

### 2. Create Application Keys
1. Log into your Backblaze account
2. Go to "App Keys" in the left sidebar
3. Click "Add a New Application Key"
4. Create keys for each bucket:
   - **Database Bucket**: `bv-studios-database`
   - **Media Bucket**: `bv-studios-media`
   - **Backups Bucket**: `bv-studios-backups`
   - **Uploads Bucket**: `bv-studios-uploads`

### 3. Create Buckets
1. Go to "Buckets" in the left sidebar
2. Create the following buckets:
   - `bv-studios-database` (Private)
   - `bv-studios-media` (Public)
   - `bv-studios-backups` (Private)
   - `bv-studios-uploads` (Public)

### 4. Environment Variables
Add the following to your `.env.local` file:

```bash
# Backblaze B2 Configuration
BACKBLAZE_KEY_ID="your-key-id"
BACKBLAZE_APPLICATION_KEY="your-application-key"
BACKBLAZE_ENDPOINT="https://s3.us-west-002.backblazeb2.com"
BACKBLAZE_REGION="us-west-002"

# Backblaze B2 Bucket Names
BACKBLAZE_DATABASE_BUCKET="bv-studios-database"
BACKBLAZE_MEDIA_BUCKET="bv-studios-media"
BACKBLAZE_BACKUPS_BUCKET="bv-studios-backups"
BACKBLAZE_UPLOADS_BUCKET="bv-studios-uploads"
```

### 5. Bucket Permissions

#### Public Buckets (Media & Uploads)
- Set CORS policy to allow uploads from your domain
- Enable public file listing (optional)

#### Private Buckets (Database & Backups)
- Keep private for security
- Use presigned URLs for access

### 6. CORS Configuration
For the public buckets, add this CORS policy:

```json
[
  {
    "corsRuleName": "bv-studios-cors",
    "allowedOrigins": ["https://your-domain.com", "http://localhost:3000"],
    "allowedOperations": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
    "allowedHeaders": ["*"],
    "exposeHeaders": ["ETag"],
    "maxAgeSeconds": 3600
  }
]
```

## Features Implemented

### 1. Database Backup
- Automatic database backups to Backblaze
- Backup listing and management
- Secure storage with versioning

### 2. Media Upload
- Direct upload to Backblaze B2
- Presigned URLs for secure uploads
- File categorization (weddings, commercial, etc.)

### 3. Video Management
- Video file listing from Backblaze
- Delete functionality
- Public URL generation

### 4. Storage Management
- File listing across buckets
- Storage usage monitoring
- File deletion capabilities

## API Endpoints

### Backup Management
- `POST /api/admin/backup` - Create database backup
- `GET /api/admin/backup` - List existing backups

### File Upload
- `POST /api/admin/upload` - Generate upload URL
- `PUT /api/admin/upload` - Direct file upload

### Storage Management
- `GET /api/admin/storage` - List files
- `DELETE /api/admin/storage` - Delete file
- `POST /api/admin/storage` - Generate download URL

## Security Considerations

1. **Access Control**: All endpoints require admin authentication
2. **Presigned URLs**: Temporary access for secure file operations
3. **Bucket Separation**: Different buckets for different data types
4. **Private Storage**: Sensitive data stored in private buckets

## Cost Optimization

1. **Lifecycle Policies**: Set up automatic deletion of old backups
2. **Compression**: Compress database backups before upload
3. **CDN**: Use Backblaze's CDN for public media files
4. **Monitoring**: Track storage usage to optimize costs

## Monitoring

### Storage Usage
- Monitor bucket sizes regularly
- Set up alerts for storage limits
- Track upload/download patterns

### Performance
- Monitor upload/download speeds
- Track API response times
- Monitor error rates

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify API keys are correct
   - Check bucket permissions
   - Ensure CORS is configured

2. **Upload Failures**
   - Check file size limits
   - Verify network connectivity
   - Check bucket permissions

3. **Download Issues**
   - Verify file exists in bucket
   - Check presigned URL expiration
   - Verify bucket permissions

### Debug Commands

```bash
# Test Backblaze connection
curl -X GET "https://api.backblazeb2.com/b2api/v2/authorize_account" \
  -u "your-key-id:your-application-key"

# List buckets
curl -X GET "https://api.backblazeb2.com/b2api/v2/b2_list_buckets" \
  -H "Authorization: your-auth-token"
```

## Next Steps

1. **Production Deployment**
   - Update environment variables for production
   - Configure proper CORS for production domain
   - Set up monitoring and alerts

2. **Advanced Features**
   - Implement file versioning
   - Add file compression
   - Set up automated backups

3. **Integration**
   - Connect with existing media management
   - Integrate with user uploads
   - Add backup scheduling 