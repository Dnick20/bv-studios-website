import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {
  UserIcon,
  FolderIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  CogIcon,
  BellIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [files, setFiles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

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

  const getStats = () => {
    const totalFiles = files.length
    const images = files.filter(f => f.type === 'image').length
    const videos = files.filter(f => f.type === 'video').length
    const documents = files.filter(f => f.type === 'document').length
    const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0)

    return { totalFiles, images, videos, documents, totalSize }
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

  const stats = getStats()

  return (
    <>
      <Head>
        <title>Dashboard | BV Studios</title>
        <meta name="description" content="Your BV Studios dashboard" />
      </Head>

      <div className="min-h-screen bg-primary">
        {/* Header */}
        <header className="bg-black/30 backdrop-blur-sm border-b border-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="text-xl font-bold text-white hover:text-accent transition-colors">
                BV Studios
              </Link>
              
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-300 hover:text-white transition-colors">
                  <BellIcon className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-300 hover:text-white transition-colors">
                  <CogIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-3 py-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* User Welcome */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Welcome back, {session.user.name}</h1>
                <p className="text-gray-300">{session.user.email}</p>
                <p className="text-sm text-accent capitalize">{session.user.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-black/20 rounded-lg p-1 mb-8">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'files', name: 'Files', icon: FolderIcon },
              { id: 'settings', name: 'Settings', icon: CogIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-accent text-primary'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Content based on active tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                  <div className="flex items-center space-x-3">
                    <FolderIcon className="w-8 h-8 text-accent" />
                    <div>
                      <p className="text-gray-300 text-sm">Total Files</p>
                      <p className="text-2xl font-bold text-white">{stats.totalFiles}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                  <div className="flex items-center space-x-3">
                    <PhotoIcon className="w-8 h-8 text-blue-400" />
                    <div>
                      <p className="text-gray-300 text-sm">Images</p>
                      <p className="text-2xl font-bold text-white">{stats.images}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                  <div className="flex items-center space-x-3">
                    <VideoCameraIcon className="w-8 h-8 text-red-400" />
                    <div>
                      <p className="text-gray-300 text-sm">Videos</p>
                      <p className="text-2xl font-bold text-white">{stats.videos}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                  <div className="flex items-center space-x-3">
                    <DocumentIcon className="w-8 h-8 text-green-400" />
                    <div>
                      <p className="text-gray-300 text-sm">Documents</p>
                      <p className="text-2xl font-bold text-white">{stats.documents}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
                {files.length === 0 ? (
                  <p className="text-gray-400">No recent activity</p>
                ) : (
                  <div className="space-y-3">
                    {files.slice(0, 5).map((file) => (
                      <div key={file.id} className="flex items-center space-x-3 p-3 bg-black/20 rounded-lg">
                        {getFileIcon(file.type)}
                        <div className="flex-1">
                          <p className="text-white font-medium">{file.name}</p>
                          <p className="text-gray-400 text-sm">
                            {new Date(file.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:text-accent/80 text-sm"
                        >
                          View
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'files' && (
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
          )}

          {activeTab === 'settings' && (
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-bold text-white mb-6">Account Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        defaultValue={session.user.name}
                        className="w-full px-4 py-3 bg-black/20 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={session.user.email}
                        disabled
                        className="w-full px-4 py-3 bg-black/20 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
                      />
                    </div>
                    <button className="px-4 py-2 bg-accent text-primary rounded-lg hover:bg-accent/90 transition-colors">
                      Update Profile
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Account Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full text-left px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                      Delete Account
                    </button>
                    <button className="w-full text-left px-4 py-3 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-lg transition-colors">
                      Export Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
} 