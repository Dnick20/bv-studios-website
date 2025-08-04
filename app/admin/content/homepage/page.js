'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomepageContentManagement() {
  const router = useRouter()
  const [content, setContent] = useState({
    heroTitle: '',
    heroSubtitle: '',
    aboutSection: '',
    servicesSection: '',
    contactSection: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/content?page=homepage', {
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
            heroTitle: 'BV Studios - Professional Video Production',
            heroSubtitle: 'Creating compelling video content that drives results for your business in Lexington, Kentucky',
            aboutSection: 'We are a full-service video production company specializing in commercial video, wedding videography, and brand storytelling. Our team of experienced professionals delivers high-quality content that captures your vision and engages your audience.',
            servicesSection: 'Our comprehensive video production services include commercial video production, wedding videography, event coverage, brand storytelling, and corporate video content. We handle everything from concept development to final delivery.',
            contactSection: 'Ready to bring your vision to life? Contact us today to discuss your project and get a free consultation. We serve the greater Lexington area and beyond.'
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
          page: 'homepage',
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
          <h1 className="text-3xl font-bold text-accent">Homepage Content Management</h1>
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
            <label className="block text-sm font-medium mb-2">About Section</label>
            <textarea
              value={content.aboutSection}
              onChange={e => setContent({ ...content, aboutSection: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-accent focus:outline-none"
              placeholder="Enter about section content"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Services Section</label>
            <textarea
              value={content.servicesSection}
              onChange={e => setContent({ ...content, servicesSection: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-accent focus:outline-none"
              placeholder="Enter services section content"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Contact Section</label>
            <textarea
              value={content.contactSection}
              onChange={e => setContent({ ...content, contactSection: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-accent focus:outline-none"
              placeholder="Enter contact section content"
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