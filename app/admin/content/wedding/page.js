'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function WeddingContentManagement() {
  const router = useRouter()
  const [content, setContent] = useState({
    heroTitle: '',
    heroSubtitle: '',
    packagesSection: '',
    testimonialsSection: '',
    gallerySection: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/content?page=wedding', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        if (data.data) {
          setContent(JSON.parse(data.data))
        } else {
          setContent({
            heroTitle: 'Wedding Videography Services',
            heroSubtitle: 'Capturing your love story with cinematic beauty and professional excellence',
            packagesSection: 'We offer comprehensive wedding videography packages designed to capture every moment of your special day. From intimate ceremonies to grand celebrations, our packages include full-day coverage, highlight films, ceremony edits, and custom features.',
            testimonialsSection: 'Our couples consistently praise our attention to detail, artistic vision, and ability to capture authentic moments. We pride ourselves on delivering not just videos, but treasured memories that couples and their families will cherish for generations.',
            gallerySection: 'Browse our collection of wedding films to see our storytelling approach and cinematic style. Each video is crafted to reflect the unique personality and love story of the couple, creating timeless memories.'
          })
        }
      }
    } catch (error) {
      setMessage('Error loading content')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        },
        body: JSON.stringify({
          page: 'wedding',
          data: JSON.stringify(content)
        })
      })
      if (response.ok) {
        setMessage('Content saved successfully!')
      } else {
        setMessage('Error saving content')
      }
    } catch (error) {
      setMessage('Error saving content')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-primary text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-accent">Wedding Content Management</h1>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
        {message && (
          <div className={`p-4 mb-6 rounded-lg ${message.includes('Error') ? 'bg-red-600' : 'bg-green-600'}`}>{message}</div>
        )}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Hero Title</label>
            <input
              type="text"
              value={content.heroTitle}
              onChange={e => setContent({ ...content, heroTitle: e.target.value })}
              className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-accent focus:outline-none"
              placeholder="Enter hero title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
            <input
              type="text"
              value={content.heroSubtitle}
              onChange={e => setContent({ ...content, heroSubtitle: e.target.value })}
              className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-accent focus:outline-none"
              placeholder="Enter hero subtitle"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Packages Section</label>
            <textarea
              value={content.packagesSection}
              onChange={e => setContent({ ...content, packagesSection: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-accent focus:outline-none"
              placeholder="Enter packages section content"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Testimonials Section</label>
            <textarea
              value={content.testimonialsSection}
              onChange={e => setContent({ ...content, testimonialsSection: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-accent focus:outline-none"
              placeholder="Enter testimonials section content"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Gallery Section</label>
            <textarea
              value={content.gallerySection}
              onChange={e => setContent({ ...content, gallerySection: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-accent focus:outline-none"
              placeholder="Enter gallery section content"
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-6 py-3 bg-accent hover:bg-accent/80 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={loadContent}
              disabled={isLoading}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 