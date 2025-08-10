'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { safeJson } from '../../../../lib/utils/safeJson'

export default function MediaUploadManagement() {
  const router = useRouter()
  const fileInputRef = useRef(null)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('weddings')

  const categories = [
    { id: 'weddings', name: 'Weddings', path: '/images/weddings/' },
    { id: 'commercial', name: 'Commercial', path: '/images/commercial/' },
    { id: 'portfolio', name: 'Portfolio', path: '/images/portfolio/' },
    { id: 'team', name: 'Team', path: '/images/team/' },
  ]

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files)
    setUploadedFiles((prev) => [...prev, ...files])
  }

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      setMessage('Please select files to upload')
      return
    }

    try {
      setIsUploading(true)

      const uploadPromises = uploadedFiles.map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('admin-token')}`,
          },
          body: JSON.stringify({
            category: selectedCategory,
            filename: file.name,
            contentType: file.type,
          }),
        })

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }

        return safeJson(response)
      })

      const results = await Promise.all(uploadPromises)
      const successfulUploads = results.filter((result) => result.uploadUrl)

      setMessage(
        `Successfully uploaded ${successfulUploads.length} files to Backblaze B2`
      )
      setUploadedFiles([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      setMessage(`Error uploading files: ${error.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleBack = () => {
    router.push('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-primary text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-accent">
            Media Upload Management
          </h1>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        {message && (
          <div
            className={`p-4 mb-6 rounded-lg ${
              message.includes('Error') ? 'bg-red-600' : 'bg-green-600'
            }`}
          >
            {message}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white focus:border-accent focus:outline-none"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Select Files
            </label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-black hover:file:bg-accent/80"
            />
          </div>

          {uploadedFiles.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Selected Files ({uploadedFiles.length})
              </label>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-black/20 rounded-lg"
                  >
                    <span className="text-sm">{file.name}</span>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleUpload}
              disabled={isUploading || uploadedFiles.length === 0}
              className="px-6 py-3 bg-accent hover:bg-accent/80 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : 'Upload Files'}
            </button>

            <button
              onClick={() => {
                setUploadedFiles([])
                if (fileInputRef.current) {
                  fileInputRef.current.value = ''
                }
              }}
              disabled={uploadedFiles.length === 0}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            >
              Clear Selection
            </button>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Upload Guidelines</h3>
            <div className="bg-black/20 p-4 rounded-lg space-y-2 text-sm">
              <p>• Supported formats: JPG, PNG, WEBP, MP4, MOV</p>
              <p>• Maximum file size: 50MB per file</p>
              <p>• Images will be automatically optimized</p>
              <p>• Videos will be compressed for web delivery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
