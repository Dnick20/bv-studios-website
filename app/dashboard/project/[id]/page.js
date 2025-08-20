'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { use } from 'react'
import Link from 'next/link'
import { safeJson } from '../../../../lib/imports.js'
import { motion } from 'framer-motion'
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
  XMarkIcon,
} from '@heroicons/react/24/outline'

export default function ProjectPage({ params }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { id } = use(params)

  const [project, setProject] = useState(null)
  const [files, setFiles] = useState([])
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [newComment, setNewComment] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [showShareModal, setShowShareModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadFile, setUploadFile] = useState(null)

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
        description:
          'A professional video production project showcasing our creative vision and technical expertise.',
        status: 'in-progress',
        client: 'John Smith',
        startDate: '2024-01-15',
        endDate: '2024-02-15',
        budget: '$5,000',
        progress: 75,
        files: [
          {
            id: 1,
            name: 'raw-footage.mp4',
            type: 'video',
            size: 2048576,
            uploadedAt: '2024-01-20',
          },
          {
            id: 2,
            name: 'final-cut.mp4',
            type: 'video',
            size: 1048576,
            uploadedAt: '2024-01-25',
          },
          {
            id: 3,
            name: 'storyboard.pdf',
            type: 'document',
            size: 512000,
            uploadedAt: '2024-01-18',
          },
          {
            id: 4,
            name: 'behind-scenes.jpg',
            type: 'image',
            size: 256000,
            uploadedAt: '2024-01-22',
          },
        ],
        comments: [
          {
            id: 1,
            user: 'Client',
            message: 'Looking great so far!',
            timestamp: '2024-01-25T10:30:00Z',
          },
          {
            id: 2,
            user: 'BV Studios',
            message: "Thanks! We'll have the final version ready by next week.",
            timestamp: '2024-01-25T11:15:00Z',
          },
        ],
      }

      setProject(mockProject)
      setFiles(mockProject.files)
      setComments(mockProject.comments)
      setEditData({
        name: mockProject.name,
        description: mockProject.description,
        client: mockProject.client,
        budget: mockProject.budget,
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
      timestamp: new Date().toISOString(),
    }

    setComments([...comments, comment])
    setNewComment('')
  }

  const handleSaveProject = async () => {
    // Simulate saving project data
    setProject({ ...project, ...editData })
    setIsEditing(false)
  }

  const handleShareProject = async () => {
    try {
      // Generate shareable link
      const shareUrl = `${window.location.origin}/dashboard/project/${id}`

      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl)

      // Show success message
      alert('Project link copied to clipboard!')
      setShowShareModal(false)
    } catch (error) {
      console.error('Error sharing project:', error)
      alert('Failed to share project')
    }
  }

  const handleDeleteProject = async () => {
    try {
      // Call API to delete project
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        alert('Project deleted successfully!')
        router.push('/dashboard')
      } else {
        throw new Error('Failed to delete project')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project')
    } finally {
      setShowDeleteModal(false)
    }
  }

  const handleUploadFile = async () => {
    if (!uploadFile) return

    try {
      const formData = new FormData()
      formData.append('file', uploadFile)
      formData.append('projectId', id)

      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await safeJson(response)

        // Add new file to the list
        const newFile = {
          id: result.file.id,
          name: result.file.name,
          type: result.file.type,
          size: result.file.size,
          uploadedAt: new Date().toISOString().split('T')[0],
        }

        setFiles([...files, newFile])
        setUploadFile(null)
        setShowUploadModal(false)
        alert('File uploaded successfully!')
      } else {
        throw new Error('Failed to upload file')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Failed to upload file')
    }
  }

  const handleFileAction = async (fileId, action) => {
    try {
      if (action === 'view') {
        window.open(`/api/files/${fileId}/view`, '_blank')
      } else if (action === 'download') {
        const response = await fetch(`/api/files/${fileId}/download`)
        if (response.ok) {
          const blob = await response.blob()
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = files.find((f) => f.id === fileId)?.name || 'file'
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
        }
      }
    } catch (error) {
      console.error('Error handling file action:', error)
      alert('Failed to perform file action')
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
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
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
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-white text-xl">Project not found</div>
      </div>
    )
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
                className="p-2 hover:bg-black/20 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="w-6 h-6 text-gray-300" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {project.name}
                </h1>
                <p className="text-gray-300">Project Details</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleShareProject}
                className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <ShareIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-accent text-primary rounded-lg hover:bg-accent/90 transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Details */}
          <div className="lg:col-span-2">
            {/* Project Info */}
            <div className="bg-black/20 rounded-lg p-6 border border-gray-800 mb-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-black/20 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Description
                    </label>
                    <textarea
                      value={editData.description}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2 bg-black/20 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        Client
                      </label>
                      <input
                        type="text"
                        value={editData.client}
                        onChange={(e) =>
                          setEditData({ ...editData, client: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-black/20 border border-gray-700 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        Budget
                      </label>
                      <input
                        type="text"
                        value={editData.budget}
                        onChange={(e) =>
                          setEditData({ ...editData, budget: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-black/20 border border-gray-700 rounded-lg text-white"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveProject}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">
                      {project.name}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${getStatusColor(
                          project.status
                        )}`}
                      ></div>
                      <span className="text-gray-300 capitalize">
                        {project.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Client</p>
                      <p className="text-white font-medium">{project.client}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Budget</p>
                      <p className="text-white font-medium">{project.budget}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Start Date</p>
                      <p className="text-white font-medium">
                        {project.startDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">End Date</p>
                      <p className="text-white font-medium">
                        {project.endDate}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="bg-black/20 rounded-lg p-6 border border-gray-800 mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-white">Progress</h3>
                <span className="text-gray-300">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Files */}
            <div className="bg-black/20 rounded-lg p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Project Files</h3>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center space-x-2 text-accent hover:text-accent/80 transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Upload File</span>
                </button>
              </div>
              <div className="space-y-4">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 bg-black/10 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                        {getFileIcon(file.type)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{file.name}</p>
                        <p className="text-gray-400 text-sm">
                          {formatFileSize(file.size)} • {file.type} •{' '}
                          {file.uploadedAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleFileAction(file.id, 'view')}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleFileAction(file.id, 'download')}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Comments */}
            <div className="bg-black/20 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">Comments</h3>
              <div className="space-y-4 mb-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-3 bg-black/10 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <UserIcon className="w-4 h-4 text-accent" />
                      <span className="text-white font-medium">
                        {comment.user}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {new Date(comment.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300">{comment.message}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddComment} className="space-y-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                  className="w-full px-3 py-2 bg-black/20 border border-gray-700 rounded-lg text-white resize-none"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-accent text-primary rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Add Comment
                </button>
              </form>
            </div>

            {/* Quick Actions */}
            <div className="bg-black/20 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="w-full flex items-center space-x-3 p-3 bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors"
                >
                  <PlusIcon className="w-5 h-5 text-accent" />
                  <span className="text-white">Upload Files</span>
                </button>
                <button
                  onClick={handleShareProject}
                  className="w-full flex items-center space-x-3 p-3 bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors"
                >
                  <ChatBubbleLeftIcon className="w-5 h-5 text-accent" />
                  <span className="text-white">Share Project</span>
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full flex items-center space-x-3 p-3 bg-red-600/10 rounded-lg hover:bg-red-600/20 transition-colors"
                >
                  <TrashIcon className="w-5 h-5 text-red-400" />
                  <span className="text-red-400">Delete Project</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Upload File</h3>
            <input
              type="file"
              onChange={(e) => setUploadFile(e.target.files[0])}
              className="w-full mb-4 p-2 bg-black/20 border border-gray-700 rounded-lg text-white"
            />
            <div className="flex space-x-3">
              <button
                onClick={handleUploadFile}
                disabled={!uploadFile}
                className="flex-1 px-4 py-2 bg-accent text-primary rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                Upload
              </button>
              <button
                onClick={() => {
                  setShowUploadModal(false)
                  setUploadFile(null)
                }}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">
              Delete Project
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete "{project.name}"? This action
              cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDeleteProject}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
