'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { safeJson } from '../../../../lib/utils/safeJson'

export default function VideoManagement() {
  const router = useRouter()
  const [videos, setVideos] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Videos' },
    { id: 'weddings', name: 'Weddings' },
    { id: 'commercial', name: 'Commercial' },
    { id: 'highlights', name: 'Highlights' },
  ]

  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = async () => {
    try {
      setIsLoading(true)

      const response = await fetch(
        '/api/admin/storage?bucket=media&prefix=media/',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin-token')}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to load videos')
      }

      const data = await safeJson(response, { files: [] })
      const videoFiles = data.files
        .filter((file) => file.key.match(/\.(mp4|mov|avi|mkv|webm)$/i))
        .map((file) => ({
          id: file.key,
          title: file.key
            .split('/')
            .pop()
            .replace(/\.[^/.]+$/, ''),
          category: file.key.split('/')[1] || 'other',
          url: file.url,
          thumbnail: file.key.replace(/\.(mp4|mov|avi|mkv|webm)$/i, '.jpg'),
          duration: 'Unknown',
          uploadDate: new Date(file.lastModified).toISOString().split('T')[0],
          size: file.size,
        }))

      setVideos(videoFiles)
    } catch (error) {
      setMessage('Error loading videos')
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteVideo = async (videoId) => {
    if (!confirm('Are you sure you want to delete this video?')) return

    try {
      setIsLoading(true)

      const response = await fetch(
        `/api/admin/storage?key=${encodeURIComponent(videoId)}&bucket=media`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin-token')}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete video')
      }

      setVideos((prev) => prev.filter((video) => video.id !== videoId))
      setMessage('Video deleted successfully from Backblaze B2')
    } catch (error) {
      setMessage('Error deleting video')
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditVideo = (video) => {
    // TODO: Implement edit modal
    setMessage('Edit functionality coming soon')
  }

  const filteredVideos =
    selectedCategory === 'all'
      ? videos
      : videos.filter((video) => video.category === selectedCategory)

  const handleBack = () => {
    router.push('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-primary text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-accent">Video Management</h1>
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
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Filter by Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-black/30 border border-gray-700 rounded-lg text-white focus:border-accent focus:outline-none"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
              <p className="mt-2">Loading videos...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-black/20 rounded-lg overflow-hidden border border-gray-700"
                >
                  <div className="aspect-video bg-gray-800 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg
                          className="w-8 h-8 text-black"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-400">{video.duration}</p>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{video.title}</h3>
                    <p className="text-sm text-gray-400 mb-2">
                      Category: {video.category}
                    </p>
                    <p className="text-sm text-gray-400 mb-4">
                      Uploaded: {video.uploadDate}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditVideo(video)}
                        className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(video.id)}
                        className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredVideos.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <p className="text-gray-400">No videos found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
