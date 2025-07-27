'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navigation from '@/components/Navigation'
import {
  UserIcon,
  FolderIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [files, setFiles] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    // Fetch user files
    fetchUserFiles()
  }, [session, status, router])

  const fetchUserFiles = async () => {
    try {
      const response = await fetch('/api/files')
      if (response.ok) {
        const data = await response.json()
        setFiles(data.files)
      }
    } catch (error) {
      console.error('Error fetching files:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const getFileIcon = (type) => {
    switch (type) {
      case 'image':
        return <PhotoIcon className="w-6 h-6 text-blue-400" />
      case 'video':
        return <VideoCameraIcon className="w-6 h-6 text-red-400" />
      case 'document':
        return <DocumentIcon className="w-6 h-6 text-green-400" />
      default:
        return <DocumentIcon className="w-6 h-6 text-gray-400" />
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  if (status === 'loading') {
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
      <Navigation />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Welcome, {session.user.name}</h1>
                  <p className="text-gray-300">{session.user.email}</p>
                  <p className="text-sm text-accent capitalize">{session.user.role}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
              <div className="flex items-center space-x-3">
                <FolderIcon className="w-8 h-8 text-accent" />
                <div>
                  <p className="text-gray-300 text-sm">Total Files</p>
                  <p className="text-2xl font-bold text-white">{files.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
              <div className="flex items-center space-x-3">
                <PhotoIcon className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-gray-300 text-sm">Images</p>
                  <p className="text-2xl font-bold text-white">
                    {files.filter(f => f.type === 'image').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
              <div className="flex items-center space-x-3">
                <VideoCameraIcon className="w-8 h-8 text-red-400" />
                <div>
                  <p className="text-gray-300 text-sm">Videos</p>
                  <p className="text-2xl font-bold text-white">
                    {files.filter(f => f.type === 'video').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Files Section */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Your Files</h2>
              <button className="flex items-center space-x-2 px-4 py-2 bg-accent text-primary rounded-lg hover:bg-accent/90 transition-colors">
                <PlusIcon className="w-5 h-5" />
                <span>Upload File</span>
              </button>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-white">Loading files...</div>
              </div>
            ) : files.length === 0 ? (
              <div className="text-center py-8">
                <FolderIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-300 text-lg">No files uploaded yet</p>
                <p className="text-gray-400 text-sm">Upload your first file to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="bg-black/20 rounded-lg p-4 border border-gray-700 hover:border-accent/50 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      {getFileIcon(file.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{file.name}</p>
                        <p className="text-gray-400 text-sm">{formatFileSize(file.size)}</p>
                        <p className="text-gray-500 text-xs capitalize">{file.type}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-xs text-gray-400">
                        {new Date(file.createdAt).toLocaleDateString()}
                      </span>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:text-accent/80 text-sm"
                      >
                        View
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 