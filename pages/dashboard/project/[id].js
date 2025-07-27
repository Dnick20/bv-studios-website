import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  FolderIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentIcon,
  PlusIcon,
  ChatBubbleLeftIcon,
  CalendarIcon,
  UserIcon,
  ClockIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

export default function ProjectPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { id } = router.query
  
  const [project, setProject] = useState(null)
  const [files, setFiles] = useState([])
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [newComment, setNewComment] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (id) {
      fetchProjectData()
    }
  }, [session, status, router, id])

  const fetchProjectData = async () => {
    try {
      // Simulate fetching project data
      const mockProject = {
        id: id,
        name: `Project ${id}`,
        description: 'A professional video production project showcasing our creative vision and technical expertise.',
        status: 'in-progress',
        client: 'John Smith',
        startDate: '2024-01-15',
        endDate: '2024-02-15',
        budget: '$5,000',
        progress: 75,
        files: [
          { id: 1, name: 'raw-footage.mp4', type: 'video', size: 2048576, uploadedAt: '2024-01-20' },
          { id: 2, name: 'final-cut.mp4', type: 'video', size: 1048576, uploadedAt: '2024-01-25' },
          { id: 3, name: 'storyboard.pdf', type: 'document', size: 512000, uploadedAt: '2024-01-18' },
          { id: 4, name: 'behind-scenes.jpg', type: 'image', size: 256000, uploadedAt: '2024-01-22' }
        ],
        comments: [
          { id: 1, user: 'Client', message: 'Looking great so far!', timestamp: '2024-01-25T10:30:00Z' },
          { id: 2, user: 'BV Studios', message: 'Thanks! We\'ll have the final version ready by next week.', timestamp: '2024-01-25T11:15:00Z' }
        ]
      }

      setProject(mockProject)
      setFiles(mockProject.files)
      setComments(mockProject.comments)
      setEditData({
        name: mockProject.name,
        description: mockProject.description,
        client: mockProject.client,
        budget: mockProject.budget
      })
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment = {
      id: Date.now(),
      user: session.user.name,
      message: newComment,
      timestamp: new Date().toISOString()
    }

    setComments([...comments, comment])
    setNewComment('')
  }

  const handleSaveProject = async () => {
    // Simulate saving project data
    setProject({ ...project, ...editData })
    setIsEditing(false)
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'in-progress':
        return 'bg-yellow-500'
      case 'pending':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-white text-xl">Loading project...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Project not found</div>
          <Link href="/dashboard" className="text-accent hover:text-accent/80">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{project.name} | BV Studios Dashboard</title>
        <meta name="description" content={`Project details for ${project.name}`} />
      </Head>

      <div className="min-h-screen bg-primary">
        {/* Header */}
        <header className="bg-black/30 backdrop-blur-sm border-b border-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                  <ArrowLeftIcon className="w-5 h-5" />
                  <span>Back to Dashboard</span>
                </Link>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 px-3 py-2 bg-accent text-primary rounded-lg hover:bg-accent/90 transition-colors">
                  <ShareIcon className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  <PencilIcon className="w-4 h-4" />
                  <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Project Header */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="text-2xl font-bold bg-black/20 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <textarea
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      rows={3}
                      className="w-full bg-black/20 border border-gray-700 rounded-lg px-3 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        value={editData.client}
                        onChange={(e) => setEditData({ ...editData, client: e.target.value })}
                        placeholder="Client name"
                        className="bg-black/20 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <input
                        type="text"
                        value={editData.budget}
                        onChange={(e) => setEditData({ ...editData, budget: e.target.value })}
                        placeholder="Budget"
                        className="bg-black/20 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveProject}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckIcon className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <XMarkIcon className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-2">{project.name}</h1>
                    <p className="text-gray-300 mb-4">{project.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-400">
                      <div className="flex items-center space-x-2">
                        <UserIcon className="w-4 h-4" />
                        <span>Client: {project.client}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{project.startDate} - {project.endDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>Budget: {project.budget}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status.replace('-', ' ')}
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Progress</div>
                  <div className="text-lg font-bold text-white">{project.progress}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-black/20 rounded-lg p-1 mb-8">
            {[
              { id: 'overview', name: 'Overview', icon: EyeIcon },
              { id: 'files', name: 'Files', icon: FolderIcon },
              { id: 'comments', name: 'Comments', icon: ChatBubbleLeftIcon }
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
              {/* Progress Bar */}
              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                <h2 className="text-xl font-bold text-white mb-4">Project Progress</h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Overall Progress</span>
                    <span className="text-white">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-accent h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckIcon className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">Planning Complete</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckIcon className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">Filming Complete</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="w-4 h-4 text-yellow-400" />
                      <span className="text-gray-300">Editing in Progress</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Files */}
              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Recent Files</h2>
                  <button className="flex items-center space-x-2 px-3 py-2 bg-accent text-primary rounded-lg hover:bg-accent/90 transition-colors">
                    <PlusIcon className="w-4 h-4" />
                    <span>Upload</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {files.slice(0, 3).map((file) => (
                    <div key={file.id} className="flex items-center space-x-3 p-3 bg-black/20 rounded-lg">
                      {getFileIcon(file.type)}
                      <div className="flex-1">
                        <p className="text-white font-medium">{file.name}</p>
                        <p className="text-gray-400 text-sm">
                          {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-1 text-gray-400 hover:text-white transition-colors">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-white transition-colors">
                          <ArrowDownTrayIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Project Files</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-accent text-primary rounded-lg hover:bg-accent/90 transition-colors">
                  <PlusIcon className="w-5 h-5" />
                  <span>Upload File</span>
                </button>
              </div>

              {files.length === 0 ? (
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
                          {new Date(file.uploadedAt).toLocaleDateString()}
                        </span>
                        <div className="flex space-x-2">
                          <button className="p-1 text-gray-400 hover:text-white transition-colors">
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-white transition-colors">
                            <ArrowDownTrayIcon className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-red-400 hover:text-red-300 transition-colors">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-bold text-white mb-6">Project Comments</h2>
              
              <div className="space-y-4 mb-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-black/20 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-white font-medium">{comment.user}</span>
                          <span className="text-gray-400 text-sm">
                            {new Date(comment.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-300">{comment.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddComment} className="space-y-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                  className="w-full bg-black/20 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-accent text-primary rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Comment
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  )
} 