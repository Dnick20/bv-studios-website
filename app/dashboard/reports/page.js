'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeftIcon,
  DocumentIcon,
  CalendarIcon,
  ClockIcon,
  FolderIcon
} from '@heroicons/react/24/outline'

export default function Reports() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reports, setReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchReports()
  }, [session, status, router])

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports')
      if (response.ok) {
        const data = await response.json()
        setReports(data.reports || [])
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Reports</h1>
              <p className="text-gray-300">View your project and file reports</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reports List */}
          <div className="lg:col-span-2">
            <div className="bg-black/20 rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-bold text-white mb-6">Your Reports</h2>
              
              {reports.length === 0 ? (
                <div className="text-center py-12">
                  <DocumentIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">No reports available yet</p>
                  <p className="text-gray-500 text-sm">Reports will be generated as you use the platform</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((report, index) => (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-black/10 rounded-lg border border-gray-700 hover:bg-black/20 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                          <DocumentIcon className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{report.title}</p>
                          <p className="text-gray-400 text-sm">{report.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-400 text-sm">{report.date}</span>
                        <button className="px-3 py-1 bg-accent text-primary rounded text-sm hover:bg-accent/90 transition-colors">
                          View
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="bg-black/20 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Total Files</span>
                  <span className="text-white font-bold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Active Projects</span>
                  <span className="text-white font-bold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Storage Used</span>
                  <span className="text-white font-bold">0 MB</span>
                </div>
              </div>
            </div>

            <div className="bg-black/20 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <p className="text-gray-300 text-sm">No recent activity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 