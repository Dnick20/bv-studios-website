'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  UserIcon,
  FolderIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentIcon,
  PlusIcon,
  ArrowRightIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userFiles, setUserFiles] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchUserFiles()
  }, [session, status, router])

  const fetchUserFiles = async () => {
    try {
      const response = await fetch('/api/files')
      if (response.ok) {
        const data = await response.json()
        setUserFiles(data.files || [])
      }
    } catch (error) {
      console.error('Error fetching files:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getFileIcon = (type) => {
    switch (type) {
      case 'image':
        return <PhotoIcon className="w-6 h-6" />
      case 'video':
        return <VideoCameraIcon className="w-6 h-6" />
      case 'document':
        return <DocumentIcon className="w-6 h-6" />
      default:
        return <FolderIcon className="w-6 h-6" />
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
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
    <>
      <Head>
        <title>Dashboard - BV Studios</title>
      </Head>

      <div className="min-h-screen bg-primary">
        {/* Header */}
        <header className="bg-black/20 backdrop-blur-sm border-b border-gray-800">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Welcome back, {session.user.name || 'User'}!</h1>
                  <p className="text-gray-300">Manage your projects and files</p>
                </div>
              </div>
              <Link
                href="/"
                className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Back to Site
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stats Cards */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/20 rounded-lg p-6 border border-gray-800"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm">Total Files</p>
                      <p className="text-3xl font-bold text-white">{userFiles.length}</p>
                    </div>
                    <FolderIcon className="w-8 h-8 text-accent" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-black/20 rounded-lg p-6 border border-gray-800"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm">Active Projects</p>
                      <p className="text-3xl font-bold text-white">3</p>
                    </div>
                    <CalendarIcon className="w-8 h-8 text-accent" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-black/20 rounded-lg p-6 border border-gray-800"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm">Storage Used</p>
                      <p className="text-3xl font-bold text-white">2.4 GB</p>
                    </div>
                    <ClockIcon className="w-8 h-8 text-accent" />
                  </div>
                </motion.div>
              </div>

              {/* Recent Files */}
              <div className="bg-black/20 rounded-lg p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Recent Files</h2>
                  <button className="flex items-center space-x-2 text-accent hover:text-accent/80 transition-colors">
                    <PlusIcon className="w-5 h-5" />
                    <span>Upload File</span>
                  </button>
                </div>

                {userFiles.length === 0 ? (
                  <div className="text-center py-12">
                    <FolderIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No files uploaded yet</p>
                    <button className="px-4 py-2 bg-accent text-primary rounded-lg hover:bg-accent/90 transition-colors">
                      Upload Your First File
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userFiles.map((file, index) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-black/10 rounded-lg border border-gray-700 hover:bg-black/20 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                            {getFileIcon(file.type)}
                          </div>
                          <div>
                            <p className="text-white font-medium">{file.name}</p>
                            <p className="text-gray-400 text-sm">
                              {formatFileSize(file.size)} • {file.type}
                            </p>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-white transition-colors">
                          <ArrowRightIcon className="w-5 h-5" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-black/20 rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    href="/dashboard/project/new"
                    className="flex items-center space-x-3 p-3 bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors"
                  >
                    <PlusIcon className="w-5 h-5 text-accent" />
                    <span className="text-white">New Project</span>
                  </Link>
                  <button className="w-full flex items-center space-x-3 p-3 bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors">
                    <PhotoIcon className="w-5 h-5 text-accent" />
                    <span className="text-white">Upload Files</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors">
                    <DocumentIcon className="w-5 h-5 text-accent" />
                    <span className="text-white">View Reports</span>
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-black/20 rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <p className="text-gray-300 text-sm">File "wedding-video.mp4" uploaded</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <p className="text-gray-300 text-sm">Project "Smith Wedding" updated</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <p className="text-gray-300 text-sm">New comment on "Commercial Project"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
} 