'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SEOSettingsManagement() {
  const router = useRouter()
  const [seoSettings, setSeoSettings] = useState({
    siteTitle: '',
    siteDescription: '',
    keywords: '',
    ogImage: '',
    twitterCard: '',
    googleAnalytics: '',
    googleTagManager: '',
    structuredData: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadSEOSettings()
  }, [])

  const loadSEOSettings = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/seo', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        if (data.siteTitle) {
          setSeoSettings(data)
        } else {
          setSeoSettings({
            siteTitle: 'BV Studios - Professional Video Production in Lexington, KY',
            siteDescription: 'Expert video production services in Lexington, Kentucky. We create compelling video content for weddings, commercials, and events. Professional videography with cinematic quality.',
            keywords: 'video production, wedding videography, commercial video, Lexington, Kentucky, videographer, wedding video, corporate video, event videography, brand storytelling',
            ogImage: '/images/og-image.jpg',
            twitterCard: 'summary_large_image',
            googleAnalytics: 'G-XXXXXXXXXX',
            googleTagManager: 'GTM-XXXXXXX',
            structuredData: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "BV Studios",
              "description": "Professional video production services in Lexington, Kentucky",
              "url": "https://bvstudios.com",
              "telephone": "+1-859-XXX-XXXX",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Lexington",
                "addressRegion": "KY",
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 38.0406,
                "longitude": -84.5037
              },
              "openingHours": "Mo-Fr 09:00-17:00",
              "priceRange": "$$",
              "serviceArea": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                  "@type": "GeoCoordinates",
                  "latitude": 38.0406,
                  "longitude": -84.5037
                },
                "geoRadius": "50000"
              }
            }, null, 2)
          })
        }
      }
    } catch (error) {
      setMessage('Error loading SEO settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        },
        body: JSON.stringify(seoSettings)
      })
      if (response.ok) {
        setMessage('SEO settings saved successfully!')
      } else {
        setMessage('Error saving SEO settings')
      }
    } catch (error) {
      setMessage('Error saving SEO settings')
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
          <h1 className="text-3xl font-bold text-accent">SEO Settings Management</h1>
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
            <label className="block text-sm font-medium mb-2">Site Title</label>
            <input
              type="text"
              value={seoSettings.siteTitle}
              onChange={e => setSeoSettings({ ...seoSettings, siteTitle: e.target.value })}
              className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-accent focus:outline-none"
              placeholder="Enter site title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Site Description</label>
            <textarea
              value={seoSettings.siteDescription}
              onChange={e => setSeoSettings({ ...seoSettings, siteDescription: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-accent focus:outline-none"
              placeholder="Enter site description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Keywords</label>
            <input
              type="text"
              value={seoSettings.keywords}
              onChange={e => setSeoSettings({ ...seoSettings, keywords: e.target.value })}
              className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-accent focus:outline-none"
              placeholder="Enter keywords (comma separated)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Open Graph Image URL</label>
            <input
              type="text"
              value={seoSettings.ogImage}
              onChange={e => setSeoSettings({ ...seoSettings, ogImage: e.target.value })}
              className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-accent focus:outline-none"
              placeholder="Enter OG image URL"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Twitter Card Type</label>
            <select
              value={seoSettings.twitterCard}
              onChange={e => setSeoSettings({ ...seoSettings, twitterCard: e.target.value })}
              className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white focus:border-accent focus:outline-none"
            >
              <option value="summary">Summary</option>
              <option value="summary_large_image">Summary Large Image</option>
              <option value="app">App</option>
              <option value="player">Player</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Google Analytics ID</label>
            <input
              type="text"
              value={seoSettings.googleAnalytics}
              onChange={e => setSeoSettings({ ...seoSettings, googleAnalytics: e.target.value })}
              className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-accent focus:outline-none"
              placeholder="Enter Google Analytics ID (G-XXXXXXXXXX)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Google Tag Manager ID</label>
            <input
              type="text"
              value={seoSettings.googleTagManager}
              onChange={e => setSeoSettings({ ...seoSettings, googleTagManager: e.target.value })}
              className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-accent focus:outline-none"
              placeholder="Enter Google Tag Manager ID (GTM-XXXXXXX)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Structured Data (JSON-LD)</label>
            <textarea
              value={seoSettings.structuredData}
              onChange={e => setSeoSettings({ ...seoSettings, structuredData: e.target.value })}
              rows={8}
              className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-accent focus:outline-none font-mono text-sm"
              placeholder="Enter structured data in JSON format"
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-6 py-3 bg-accent hover:bg-accent/80 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save SEO Settings'}
            </button>
            <button
              onClick={loadSEOSettings}
              disabled={isLoading}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            >
              Reset
            </button>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">SEO Guidelines</h3>
            <div className="bg-black/20 p-4 rounded-lg space-y-2 text-sm">
              <p>• Site title should be 50-60 characters</p>
              <p>• Description should be 150-160 characters</p>
              <p>• Use relevant keywords naturally</p>
              <p>• OG image should be 1200x630 pixels</p>
              <p>• Structured data helps search engines understand your content</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 