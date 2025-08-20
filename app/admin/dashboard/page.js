'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  AnalyticsDashboard,
  WeddingQuoteManager,
  analytics,
  safeJson,
} from '../../../lib/imports.js'
import {
  DocumentIcon,
  CreditCardIcon,
  FolderIcon,
  UserIcon,
  CalendarIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  HeartIcon,
  PhotoIcon,
  VideoCameraIcon,
  GiftIcon,
  CloudArrowUpIcon,
  AdjustmentsHorizontalIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'
// NOTE: safeFetchJson already re-exported from safeJson module; avoid duplicate imports

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [users, setUsers] = useState([])
  const [projects, setProjects] = useState([])
  const [notifications, setNotifications] = useState([])
  const [adminUser, setAdminUser] = useState(null)

  // Modal states
  const [showUserModal, setShowUserModal] = useState(false)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showEditUserModal, setShowEditUserModal] = useState(false)
  const [showEditProjectModal, setShowEditProjectModal] = useState(false)

  // Form states
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'client',
    status: 'active',
  })

  const [projectForm, setProjectForm] = useState({
    title: '',
    client: '',
    budget: '',
    description: '',
    startDate: '',
    endDate: '',
  })

  // Edit states
  const [editingUser, setEditingUser] = useState(null)
  const [editingProject, setEditingProject] = useState(null)

  const router = useRouter()

  const [stats, setStats] = useState({
    totalVideos: 0,
    happyClients: 0,
    yearsExperience: 0,
    clientSatisfaction: 100,
    completionRate: 0,
  })

  // Wedding management states
  const [weddingContracts, setWeddingContracts] = useState([])
  const [weddingPayments, setWeddingPayments] = useState([])
  const [weddingFiles, setWeddingFiles] = useState([])
  const [clientSubscriptions, setClientSubscriptions] = useState([])
  const [weddingTimelines, setWeddingTimelines] = useState([])
  const [selectedClient, setSelectedClient] = useState(null)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [showFileUploadModal, setShowFileUploadModal] = useState(false)

  useEffect(() => {
    // Check for admin token in localStorage
    const adminToken = localStorage.getItem('adminToken')
    const adminUserData = localStorage.getItem('adminUser')

    if (!adminToken || !adminUserData) {
      router.push('/admin')
      return
    }

    try {
      const user = JSON.parse(adminUserData)
      if (user.role !== 'admin') {
        router.push('/admin')
        return
      }

      // Track admin dashboard access
      analytics.adminActionPerformed('dashboard_accessed', {
        admin_user: user.username,
        timestamp: new Date().toISOString(),
      })
      setAdminUser(user)
    } catch (error) {
      router.push('/admin')
      return
    }

    loadDashboardData()
    loadMockWeddingData()
    setIsLoading(false)

    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.stats) setStats(data.stats)
      })
  }, [router])

  const loadDashboardData = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken')
      const headers = {
        'Content-Type': 'application/json',
        'x-admin-token': adminToken,
      }

      // Load users
      const usersResponse = await fetch('/api/admin/users', { headers })
      if (usersResponse.ok) {
        const usersData = await usersResponse
          .json()
          .catch(() => ({ users: [] }))
        setUsers(usersData.users)
      }

      // Load projects
      const projectsResponse = await fetch('/api/admin/projects', { headers })
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse
          .json()
          .catch(() => ({ projects: [] }))
        setProjects(projectsData.projects)
      }

      // Load wedding management data
      const contractsResponse = await fetch('/api/admin/wedding/contracts', { headers })
      if (contractsResponse.ok) {
        const contractsData = await contractsResponse.json().catch(() => ({ contracts: [] }))
        setWeddingContracts(contractsData.contracts)
      }

      const paymentsResponse = await fetch('/api/admin/wedding/payments', { headers })
      if (paymentsResponse.ok) {
        const paymentsData = await paymentsResponse.json().catch(() => ({ payments: [] }))
        setWeddingPayments(paymentsData.payments)
      }

      const filesResponse = await fetch('/api/admin/wedding/files', { headers })
      if (filesResponse.ok) {
        const filesData = await filesResponse.json().catch(() => ({ files: [] }))
        setWeddingFiles(filesData.files)
      }

      const subscriptionsResponse = await fetch('/api/admin/subscriptions', { headers })
      if (subscriptionsResponse.ok) {
        const subscriptionsData = await subscriptionsResponse.json().catch(() => ({ subscriptions: [] }))
        setClientSubscriptions(subscriptionsData.subscriptions)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      // If API fails, load mock data
      loadMockWeddingData()
    }
  }

  const loadMockWeddingData = () => {
    // Mock wedding contracts data
    setWeddingContracts([
      {
        id: '1',
        clientName: 'Sarah & Michael Johnson',
        title: 'Wedding Videography Package',
        weddingDate: '2024-10-15',
        package: 'Gold Collection',
        status: 'signed',
        value: 4100,
        createdAt: '2024-08-01',
        contractSignedAt: '2024-08-05',
        depositReceivedAt: '2024-08-05'
      },
      {
        id: '2',
        clientName: 'Emily & David Rodriguez',
        title: 'Wedding Videography Package',
        weddingDate: '2024-11-22',
        package: 'Diamond Collection',
        status: 'sent',
        value: 6500,
        createdAt: '2024-08-10',
        preMeetingScheduled: '2024-11-15'
      }
    ])

    // Mock wedding payments data
    setWeddingPayments([
      {
        id: '1',
        clientName: 'Sarah & Michael Johnson',
        description: 'Final Payment - Wedding Package',
        amount: 2050,
        dueDate: '2024-10-01',
        status: 'pending',
        type: 'final_payment'
      },
      {
        id: '2',
        clientName: 'Emily & David Rodriguez',
        description: 'Deposit - Wedding Package',
        amount: 3250,
        dueDate: '2024-08-15',
        status: 'paid',
        type: 'deposit',
        paidAt: '2024-08-12'
      }
    ])

    // Mock wedding files data
    setWeddingFiles([
      {
        id: '1',
        clientName: 'Sarah & Michael Johnson',
        name: 'Engagement_Session_Photos.zip',
        type: 'image',
        size: 245760000, // 245MB
        uploadedAt: '2024-08-20',
        downloadCount: 3,
        isNew: true
      },
      {
        id: '2',
        clientName: 'Emily & David Rodriguez',
        name: 'Contract_Diamond_Collection.pdf',
        type: 'document',
        size: 2048000, // 2MB
        uploadedAt: '2024-08-15',
        downloadCount: 1,
        isNew: false
      }
    ])

    // Mock client subscriptions data
    setClientSubscriptions([
      {
        id: '1',
        clientName: 'Sarah & Michael Johnson',
        plan: 'Premium Access',
        status: 'trial',
        startDate: '2024-08-15',
        trialEndsAt: '2024-10-15',
        monthlyRate: 10
      },
      {
        id: '2',
        clientName: 'Emily & David Rodriguez',
        plan: 'Premium Access',
        status: 'active',
        startDate: '2024-07-01',
        nextBillingDate: '2024-09-01',
        monthlyRate: 10
      }
    ])

      // Mock notifications
      setNotifications([
        {
          id: 1,
          message: 'New user registration: mike@example.com',
          type: 'info',
          time: '2 hours ago',
        },
        {
          id: 2,
          message: 'Project completed: Wedding Video - Sarah & Mike',
          type: 'success',
          time: '4 hours ago',
        },
        {
          id: 3,
          message: 'Payment received: $2,500 for Commercial Project',
          type: 'success',
          time: '6 hours ago',
        },
      ])
  }

  const handleLogout = () => {
    // Clear admin tokens from localStorage
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    // Redirect to admin login page
    router.push('/admin')
  }

  const handleTabChange = (tab) => {
    console.log('Tab changed to:', tab)
    setActiveTab(tab)
  }

  const handleSyncWeddingData = async () => {
    try {
      const response = await fetch('/api/admin/wedding-data/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await safeJson(response)
      if (!response.ok) throw new Error(data?.message || 'Sync failed')
      alert('Wedding data synced successfully')
    } catch (error) {
      console.error('Sync error:', error)
      alert('Failed to sync wedding data')
    }
  }

  const handleUserAction = async (action, userId) => {
    console.log('User action:', action, 'for user:', userId)

    if (action === 'edit') {
      const user = users.find((u) => u.id === userId)
      setEditingUser(user)
      setUserForm({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      })
      setShowEditUserModal(true)
    } else if (action === 'delete') {
      if (confirm('Are you sure you want to delete this user?')) {
        try {
          const response = await fetch(`/api/admin/users?id=${userId}`, {
            method: 'DELETE',
          })

          if (response.ok) {
            setUsers(users.filter((u) => u.id !== userId))
            alert('User deleted successfully')
          }
        } catch (error) {
          console.error('Error deleting user:', error)
          alert('Error deleting user')
        }
      }
    }
  }

  const handleProjectAction = async (action, projectId) => {
    console.log('Project action:', action, 'for project:', projectId)

    if (action === 'edit') {
      const project = projects.find((p) => p.id === projectId)
      setEditingProject(project)
      setProjectForm({
        title: project.title,
        client: project.client,
        budget: project.budget.toString(),
        description: project.description,
        startDate: project.startDate,
        endDate: project.endDate,
      })
      setShowEditProjectModal(true)
    } else if (action === 'delete') {
      if (confirm('Are you sure you want to delete this project?')) {
        try {
          const response = await fetch(`/api/admin/projects?id=${projectId}`, {
            method: 'DELETE',
          })

          if (response.ok) {
            setProjects(projects.filter((p) => p.id !== projectId))
            alert('Project deleted successfully')
          }
        } catch (error) {
          console.error('Error deleting project:', error)
          alert('Error deleting project')
        }
      }
    }
  }

  const handleCreateUser = async (e) => {
    console.log('Creating new user...')
    e.preventDefault()

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userForm),
      })

      if (response.ok) {
        const data = await safeJson(response)
        setUsers([...users, data.user])
        setShowUserModal(false)
        setUserForm({ name: '', email: '', role: 'client', status: 'active' })
        alert('User created successfully')
      } else {
        const error = await safeJson(response)
        alert(error.message || 'Error creating user')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Error creating user')
    }
  }

  const handleCreateProject = async (e) => {
    console.log('Creating new project...')
    e.preventDefault()

    try {
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectForm),
      })

      if (response.ok) {
        const data = await safeJson(response)
        setProjects([...projects, data.project])
        setShowProjectModal(false)
        setProjectForm({
          title: '',
          client: '',
          budget: '',
          description: '',
          startDate: '',
          endDate: '',
        })
        alert('Project created successfully')
      } else {
        const error = await safeJson(response)
        alert(error.message || 'Error creating project')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Error creating project')
    }
  }

  const handleUpdateUser = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingUser.id,
          ...userForm,
        }),
      })

      if (response.ok) {
        const data = await safeJson(response)
        setUsers(users.map((u) => (u.id === editingUser.id ? data.user : u)))
        setShowEditUserModal(false)
        setEditingUser(null)
        setUserForm({ name: '', email: '', role: 'client', status: 'active' })
        alert('User updated successfully')
      } else {
        const error = await safeJson(response)
        alert(error.message || 'Error updating user')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Error updating user')
    }
  }

  const handleUpdateProject = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/admin/projects', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingProject.id,
          ...projectForm,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setProjects(
          projects.map((p) => (p.id === editingProject.id ? data.project : p))
        )
        setShowEditProjectModal(false)
        setEditingProject(null)
        setProjectForm({
          title: '',
          client: '',
          budget: '',
          description: '',
          startDate: '',
          endDate: '',
        })
        alert('Project updated successfully')
      } else {
        const error = await response.json()
        alert(error.message || 'Error updating project')
      }
    } catch (error) {
      console.error('Error updating project:', error)
      alert('Error updating project')
    }
  }

  if (isLoading || status === 'loading') {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#000',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#000',
        color: '#fff',
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: '#111',
          padding: '20px',
          borderBottom: '1px solid #333',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            Admin Dashboard
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span>Welcome, {adminUser?.username || 'admin'}</span>
            <button
              onClick={handleLogout}
              style={{
                padding: '10px 20px',
                backgroundColor: '#ff0000',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            marginTop: '20px',
            borderBottom: '1px solid #333',
          }}
        >
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'users', label: 'Users' },
            { id: 'projects', label: 'Projects' },
            { id: 'wedding-contracts', label: 'Wedding Contracts' },
            { id: 'wedding-payments', label: 'Wedding Payments' },
            { id: 'wedding-files', label: 'Client Files' },
            { id: 'subscriptions', label: 'Subscriptions' },
            { id: 'wedding-timeline', label: 'Wedding Timeline' },
            { id: 'content', label: 'Content' },
            { id: 'bots', label: 'Bots' },
            { id: 'analytics', label: 'Analytics' },
            { id: 'reports', label: 'Reports' },
            { id: 'wedding-quotes', label: 'Wedding Quotes' },
            { id: 'settings', label: 'Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              style={{
                padding: '10px 20px',
                backgroundColor:
                  activeTab === tab.id ? '#00ff00' : 'transparent',
                color: activeTab === tab.id ? '#000' : '#fff',
                border: 'none',
                borderRadius: '5px 5px 0 0',
                cursor: 'pointer',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '20px' }}>
        {/* Debug Section */}
        <div
          style={{
            backgroundColor: '#111',
            padding: '15px',
            borderRadius: '5px',
            marginBottom: '20px',
            border: '1px solid #333',
          }}
        >
          <h3 style={{ color: '#00ff00', marginBottom: '10px' }}>Debug Info</h3>
          <p style={{ color: '#ccc', fontSize: '12px' }}>
            showUserModal: {showUserModal ? 'true' : 'false'}
          </p>
          <p style={{ color: '#ccc', fontSize: '12px' }}>
            showProjectModal: {showProjectModal ? 'true' : 'false'}
          </p>
          <p style={{ color: '#ccc', fontSize: '12px' }}>
            activeTab: {activeTab}
          </p>
          <p style={{ color: '#ccc', fontSize: '12px' }}>
            Users count: {users.length}
          </p>
          <p style={{ color: '#ccc', fontSize: '12px' }}>
            Projects count: {projects.length}
          </p>
        </div>

        {activeTab === 'bots' && (
          <div
            style={{
              backgroundColor: '#111',
              padding: '20px',
              borderRadius: '5px',
              border: '1px solid #333',
            }}
          >
            <h2 style={{ color: '#00ff00', marginBottom: '20px' }}>Bots</h2>
            <button
              onClick={handleSyncWeddingData}
              style={{
                padding: '10px 20px',
                backgroundColor: '#00ff00',
                color: '#000',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Sync Wedding Data
            </button>
          </div>
        )}

        {activeTab === 'wedding-quotes' && (
          <div
            style={{
              backgroundColor: '#111',
              padding: '20px',
              borderRadius: '5px',
              border: '1px solid #333',
            }}
          >
            <h2 style={{ color: '#00ff00', marginBottom: '20px' }}>
              Wedding Quote Management
            </h2>
            <WeddingQuoteManager isAdmin={true} />
          </div>
        )}
      </div>

      {/* User Modal */}
      {showUserModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#111',
              padding: '30px',
              borderRadius: '10px',
              border: '1px solid #333',
              width: '90%',
              maxWidth: '500px',
            }}
          >
            <h2 style={{ marginBottom: '20px', color: '#00ff00' }}>
              Create New User
            </h2>
            <form onSubmit={handleCreateUser}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Name
                </label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) =>
                    setUserForm({ ...userForm, name: e.target.value })
                  }
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#333',
                    border: '1px solid #555',
                    borderRadius: '5px',
                    color: '#fff',
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm({ ...userForm, email: e.target.value })
                  }
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#333',
                    border: '1px solid #555',
                    borderRadius: '5px',
                    color: '#fff',
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Role
                </label>
                <select
                  value={userForm.role}
                  onChange={(e) =>
                    setUserForm({ ...userForm, role: e.target.value })
                  }
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#333',
                    border: '1px solid #555',
                    borderRadius: '5px',
                    color: '#fff',
                  }}
                >
                  <option value="client">Client</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Status
                </label>
                <select
                  value={userForm.status}
                  onChange={(e) =>
                    setUserForm({ ...userForm, status: e.target.value })
                  }
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#333',
                    border: '1px solid #555',
                    borderRadius: '5px',
                    color: '#fff',
                  }}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#00ff00',
                    color: '#000',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  Create User
                </button>
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#666',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Modal */}
      {showProjectModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#111',
              padding: '30px',
              borderRadius: '10px',
              border: '1px solid #333',
              width: '90%',
              maxWidth: '500px',
            }}
          >
            <h2 style={{ marginBottom: '20px', color: '#00ff00' }}>
              Create New Project
            </h2>
            <form onSubmit={handleCreateProject}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Title
                </label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, title: e.target.value })
                  }
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#333',
                    border: '1px solid #555',
                    borderRadius: '5px',
                    color: '#fff',
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Client
                </label>
                <input
                  type="text"
                  value={projectForm.client}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, client: e.target.value })
                  }
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#333',
                    border: '1px solid #555',
                    borderRadius: '5px',
                    color: '#fff',
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Budget
                </label>
                <input
                  type="number"
                  value={projectForm.budget}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, budget: e.target.value })
                  }
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#333',
                    border: '1px solid #555',
                    borderRadius: '5px',
                    color: '#fff',
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Start Date
                </label>
                <input
                  type="date"
                  value={projectForm.startDate}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      startDate: e.target.value,
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#333',
                    border: '1px solid #555',
                    borderRadius: '5px',
                    color: '#fff',
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  End Date
                </label>
                <input
                  type="date"
                  value={projectForm.endDate}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, endDate: e.target.value })
                  }
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#333',
                    border: '1px solid #555',
                    borderRadius: '5px',
                    color: '#fff',
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Description
                </label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      description: e.target.value,
                    })
                  }
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#333',
                    border: '1px solid #555',
                    borderRadius: '5px',
                    color: '#fff',
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#00ff00',
                    color: '#000',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  Create Project
                </button>
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#666',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && editingUser && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#111',
              padding: '30px',
              borderRadius: '10px',
              border: '1px solid #333',
              width: '90%',
              maxWidth: '500px',
            }}
          >
            <h2 style={{ marginBottom: '20px', color: '#00ff00' }}>
              Edit User
            </h2>
            <form onSubmit={handleUpdateUser}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Name
                </label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#333',
                    border: '1px solid #555',
                    borderRadius: '5px',
                    color: '#fff',
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#333',
                    border: '1px solid #555',
                    borderRadius: '5px',
                    color: '#fff',
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Role
                </label>
                <select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#333',
                    border: '1px solid #555',
                    borderRadius: '5px',
                    color: '#fff',
                  }}
                >
                  <option value="client">Client</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Status
                </label>
                <select
                  value={editingUser.status}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, status: e.target.value })
                  }
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#333',
                    border: '1px solid #555',
                    borderRadius: '5px',
                    color: '#fff',
                  }}
                >
                  <option value="admin">Admin</option>
                  <option value="client">Client</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#00ff00',
                    color: '#000',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  Update User
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditUserModal(false)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#666',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditProjectModal && editingProject && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#111',
              padding: '30px',
              borderRadius: '10px',
              border: '1px solid #333',
              width: '90%',
              maxWidth: '500px',
            }}
          >
            <h2 style={{ marginBottom: '20px', color: '#00ff00' }}>
              Edit Project
            </h2>
            <form onSubmit={handleUpdateProject}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Title
                </label>
                <input
                  type="text"
                  value={editingProject.title}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      title: e.target.value,
                    })
                  }
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#333',
                    border: '1px solid #555',
                    borderRadius: '5px',
                    color: '#fff',
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Client
                </label>
                <input
                  type="text"
                  value={editingProject.client}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      client: e.target.value,
                    })
                  }
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#333',
                    border: '1px solid #555',
                    borderRadius: '5px',
                    color: '#fff',
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Budget
                </label>
                <input
                  type="number"
                  value={editingProject.budget}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      budget: e.target.value,
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#333',
                    border: '1px solid #555',
                    borderRadius: '5px',
                    color: '#fff',
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Start Date
                </label>
                <input
                  type="date"
                  value={editingProject.startDate}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      startDate: e.target.value,
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#333',
                    border: '1px solid #555',
                    borderRadius: '5px',
                    color: '#fff',
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  End Date
                </label>
                <input
                  type="date"
                  value={editingProject.endDate}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      endDate: e.target.value,
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#333',
                    border: '1px solid #555',
                    borderRadius: '5px',
                    color: '#fff',
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Description
                </label>
                <textarea
                  value={editingProject.description}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      description: e.target.value,
                    })
                  }
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#333',
                    border: '1px solid #555',
                    borderRadius: '5px',
                    color: '#fff',
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#00ff00',
                    color: '#000',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  Update Project
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditProjectModal(false)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#666',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Render Functions */}
      {activeTab === 'overview' && (
        <div
          style={{
            backgroundColor: '#111',
            padding: '20px',
            borderRadius: '5px',
            border: '1px solid #333',
            marginTop: '20px',
          }}
        >
          <h2 style={{ color: '#00ff00', marginBottom: '20px' }}>Overview</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
            }}
          >
            <div
              style={{
                backgroundColor: '#222',
                padding: '20px',
                borderRadius: '5px',
                textAlign: 'center',
              }}
            >
              <h3 style={{ color: '#00ff00', marginBottom: '10px' }}>
                Total Users
              </h3>
              <p style={{ fontSize: '2rem', color: '#fff' }}>{users.length}</p>
            </div>
            <div
              style={{
                backgroundColor: '#222',
                padding: '20px',
                borderRadius: '5px',
                textAlign: 'center',
              }}
            >
              <h3 style={{ color: '#00ff00', marginBottom: '10px' }}>
                Total Projects
              </h3>
              <p style={{ fontSize: '2rem', color: '#fff' }}>
                {projects.length}
              </p>
            </div>
            <div
              style={{
                backgroundColor: '#222',
                padding: '20px',
                borderRadius: '5px',
                textAlign: 'center',
              }}
            >
              <h3 style={{ color: '#00ff00', marginBottom: '10px' }}>
                Total Videos
              </h3>
              <p style={{ fontSize: '2rem', color: '#fff' }}>
                {stats.totalVideos}
              </p>
            </div>
            <div
              style={{
                backgroundColor: '#222',
                padding: '20px',
                borderRadius: '5px',
                textAlign: 'center',
              }}
            >
              <h3 style={{ color: '#00ff00', marginBottom: '10px' }}>
                Client Satisfaction
              </h3>
              <p style={{ fontSize: '2rem', color: '#fff' }}>
                {stats.clientSatisfaction}%
              </p>
            </div>
            <div
              style={{
                backgroundColor: '#222',
                padding: '20px',
                borderRadius: '5px',
                textAlign: 'center',
              }}
            >
              <h3 style={{ color: '#00ff00', marginBottom: '10px' }}>
                Active Weddings
              </h3>
              <p style={{ fontSize: '2rem', color: '#fff' }}>
                {weddingContracts.filter(c => c.status === 'active').length}
              </p>
            </div>
            <div
              style={{
                backgroundColor: '#222',
                padding: '20px',
                borderRadius: '5px',
                textAlign: 'center',
              }}
            >
              <h3 style={{ color: '#00ff00', marginBottom: '10px' }}>
                Pending Payments
              </h3>
              <p style={{ fontSize: '2rem', color: '#fff' }}>
                {weddingPayments.filter(p => p.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Wedding Contracts Tab */}
      {activeTab === 'wedding-contracts' && (
        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '5px', border: '1px solid #333', marginTop: '20px' }}>
          <h2 style={{ color: '#00ff00', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <DocumentIcon style={{ width: '24px', height: '24px' }} />
            Wedding Contracts Management
          </h2>
          <div style={{ display: 'grid', gap: '15px' }}>
            {weddingContracts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#ccc' }}>
                <DocumentIcon style={{ width: '48px', height: '48px', margin: '0 auto 20px', opacity: 0.5 }} />
                <p>No wedding contracts found</p>
              </div>
            ) : (
              weddingContracts.map((contract) => (
                <div key={contract.id} style={{ backgroundColor: '#222', padding: '20px', borderRadius: '5px', border: '1px solid #333' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                    <div>
                      <h3 style={{ color: '#fff', marginBottom: '8px', fontSize: '18px' }}>{contract.clientName} - {contract.title}</h3>
                      <p style={{ color: '#ccc', fontSize: '14px' }}>Wedding Date: {new Date(contract.weddingDate).toLocaleDateString()}</p>
                      <p style={{ color: '#ccc', fontSize: '14px' }}>Package: {contract.package}</p>
                      <p style={{ color: '#ccc', fontSize: '14px' }}>Created: {new Date(contract.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        padding: '6px 12px',
                        borderRadius: '15px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        marginBottom: '8px',
                        backgroundColor: contract.status === 'signed' ? '#059669' : contract.status === 'sent' ? '#D97706' : '#6B7280',
                        color: '#fff'
                      }}>
                        {contract.status.toUpperCase()}
                      </div>
                      <p style={{ color: '#00ff00', fontSize: '16px', fontWeight: 'bold' }}>${contract.value?.toLocaleString()}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button style={{ padding: '8px 16px', backgroundColor: '#0066cc', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
                      View Contract
                    </button>
                    {contract.status === 'draft' && (
                      <button style={{ padding: '8px 16px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
                        Send to Client
                      </button>
                    )}
                    <button style={{ padding: '8px 16px', backgroundColor: '#DC2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
                      Edit
                    </button>
                    <button style={{ padding: '8px 16px', backgroundColor: '#6B7280', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
                      Message Client
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Wedding Payments Tab */}
      {activeTab === 'wedding-payments' && (
        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '5px', border: '1px solid #333', marginTop: '20px' }}>
          <h2 style={{ color: '#00ff00', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CreditCardIcon style={{ width: '24px', height: '24px' }} />
            Wedding Payments Management
          </h2>
          <div style={{ display: 'grid', gap: '15px' }}>
            {weddingPayments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#ccc' }}>
                <CreditCardIcon style={{ width: '48px', height: '48px', margin: '0 auto 20px', opacity: 0.5 }} />
                <p>No wedding payments found</p>
              </div>
            ) : (
              weddingPayments.map((payment) => (
                <div key={payment.id} style={{ backgroundColor: '#222', padding: '20px', borderRadius: '5px', border: '1px solid #333' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                    <div>
                      <h3 style={{ color: '#fff', marginBottom: '8px', fontSize: '18px' }}>{payment.clientName} - {payment.description}</h3>
                      <p style={{ color: '#ccc', fontSize: '14px' }}>Due Date: {new Date(payment.dueDate).toLocaleDateString()}</p>
                      <p style={{ color: '#ccc', fontSize: '14px' }}>Payment Type: {payment.type}</p>
                      {payment.paidAt && (
                        <p style={{ color: '#059669', fontSize: '14px' }}>Paid: {new Date(payment.paidAt).toLocaleDateString()}</p>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        padding: '6px 12px',
                        borderRadius: '15px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        marginBottom: '8px',
                        backgroundColor: payment.status === 'paid' ? '#059669' : payment.status === 'pending' ? '#D97706' : payment.status === 'overdue' ? '#DC2626' : '#6B7280',
                        color: '#fff'
                      }}>
                        {payment.status.toUpperCase()}
                      </div>
                      <p style={{ color: '#00ff00', fontSize: '20px', fontWeight: 'bold' }}>${payment.amount?.toLocaleString()}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button style={{ padding: '8px 16px', backgroundColor: '#0066cc', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
                      View Details
                    </button>
                    {payment.status === 'pending' && (
                      <>
                        <button style={{ padding: '8px 16px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
                          Mark as Paid
                        </button>
                        <button style={{ padding: '8px 16px', backgroundColor: '#D97706', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
                          Send Reminder
                        </button>
                      </>
                    )}
                    <button style={{ padding: '8px 16px', backgroundColor: '#6B7280', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
                      Generate Invoice
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Wedding Files Tab */}
      {activeTab === 'wedding-files' && (
        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '5px', border: '1px solid #333', marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#00ff00', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
              <FolderIcon style={{ width: '24px', height: '24px' }} />
              Client File Delivery
            </h2>
            <button
              onClick={() => setShowFileUploadModal(true)}
              style={{ padding: '10px 20px', backgroundColor: '#00ff00', color: '#000', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <CloudArrowUpIcon style={{ width: '16px', height: '16px' }} />
              Upload Files
            </button>
          </div>
          
          {/* Client Selector */}
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#222', borderRadius: '5px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>Select Client:</label>
            <select
              value={selectedClient || ''}
              onChange={(e) => setSelectedClient(e.target.value)}
              style={{ width: '100%', padding: '10px', backgroundColor: '#333', border: '1px solid #555', borderRadius: '5px', color: '#fff' }}
            >
              <option value="">All Clients</option>
              {Array.from(new Set(weddingFiles.map(f => f.clientName))).map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
            {(selectedClient ? weddingFiles.filter(f => f.clientName === selectedClient) : weddingFiles).length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#ccc' }}>
                <FolderIcon style={{ width: '48px', height: '48px', margin: '0 auto 20px', opacity: 0.5 }} />
                <p>No files uploaded {selectedClient ? `for ${selectedClient}` : 'yet'}</p>
              </div>
            ) : (
              (selectedClient ? weddingFiles.filter(f => f.clientName === selectedClient) : weddingFiles).map((file) => (
                <div key={file.id} style={{ backgroundColor: '#222', padding: '15px', borderRadius: '5px', border: '1px solid #333' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ width: '40px', height: '40px', backgroundColor: '#333', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {file.type === 'video' ? <VideoCameraIcon style={{ width: '20px', height: '20px', color: '#00ff00' }} /> :
                       file.type === 'image' ? <PhotoIcon style={{ width: '20px', height: '20px', color: '#00ff00' }} /> :
                       <DocumentIcon style={{ width: '20px', height: '20px', color: '#00ff00' }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ color: '#fff', margin: 0, fontSize: '14px' }}>{file.name}</h4>
                      <p style={{ color: '#ccc', margin: 0, fontSize: '12px' }}>{file.clientName}</p>
                    </div>
                    {file.isNew && (
                      <div style={{ padding: '2px 8px', backgroundColor: '#059669', borderRadius: '10px', fontSize: '10px', color: '#fff' }}>NEW</div>
                    )}
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <p style={{ color: '#ccc', fontSize: '12px', margin: '2px 0' }}>Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p style={{ color: '#ccc', fontSize: '12px', margin: '2px 0' }}>Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}</p>
                    <p style={{ color: '#ccc', fontSize: '12px', margin: '2px 0' }}>Downloads: {file.downloadCount || 0}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button style={{ padding: '6px 12px', backgroundColor: '#0066cc', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}>
                      Preview
                    </button>
                    <button style={{ padding: '6px 12px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}>
                      Download
                    </button>
                    <button style={{ padding: '6px 12px', backgroundColor: '#DC2626', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}>
                      Delete
                    </button>
                    <button style={{ padding: '6px 12px', backgroundColor: '#6B7280', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}>
                      Notify Client
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Subscriptions Tab */}
      {activeTab === 'subscriptions' && (
        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '5px', border: '1px solid #333', marginTop: '20px' }}>
          <h2 style={{ color: '#00ff00', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BanknotesIcon style={{ width: '24px', height: '24px' }} />
            Client Subscriptions Management
          </h2>
          <div style={{ display: 'grid', gap: '15px' }}>
            {clientSubscriptions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#ccc' }}>
                <BanknotesIcon style={{ width: '48px', height: '48px', margin: '0 auto 20px', opacity: 0.5 }} />
                <p>No client subscriptions found</p>
              </div>
            ) : (
              clientSubscriptions.map((subscription) => (
                <div key={subscription.id} style={{ backgroundColor: '#222', padding: '20px', borderRadius: '5px', border: '1px solid #333' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                    <div>
                      <h3 style={{ color: '#fff', marginBottom: '8px', fontSize: '18px' }}>{subscription.clientName}</h3>
                      <p style={{ color: '#ccc', fontSize: '14px' }}>Plan: {subscription.plan}</p>
                      <p style={{ color: '#ccc', fontSize: '14px' }}>Started: {new Date(subscription.startDate).toLocaleDateString()}</p>
                      {subscription.trialEndsAt && (
                        <p style={{ color: subscription.status === 'trial' ? '#D97706' : '#ccc', fontSize: '14px' }}>
                          Trial ends: {new Date(subscription.trialEndsAt).toLocaleDateString()}
                        </p>
                      )}
                      {subscription.nextBillingDate && (
                        <p style={{ color: '#ccc', fontSize: '14px' }}>Next billing: {new Date(subscription.nextBillingDate).toLocaleDateString()}</p>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        padding: '6px 12px',
                        borderRadius: '15px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        marginBottom: '8px',
                        backgroundColor: subscription.status === 'active' ? '#059669' : subscription.status === 'trial' ? '#D97706' : subscription.status === 'expired' ? '#DC2626' : '#6B7280',
                        color: '#fff'
                      }}>
                        {subscription.status.toUpperCase()}
                      </div>
                      <p style={{ color: '#00ff00', fontSize: '16px', fontWeight: 'bold' }}>
                        ${subscription.monthlyRate}/month
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button style={{ padding: '8px 16px', backgroundColor: '#0066cc', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
                      View Details
                    </button>
                    {subscription.status === 'trial' && (
                      <button style={{ padding: '8px 16px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
                        Convert to Paid
                      </button>
                    )}
                    {subscription.status === 'expired' && (
                      <button style={{ padding: '8px 16px', backgroundColor: '#D97706', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
                        Reactivate
                      </button>
                    )}
                    <button style={{ padding: '8px 16px', backgroundColor: '#6B7280', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
                      Billing History
                    </button>
                    <button style={{ padding: '8px 16px', backgroundColor: '#DC2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
                      Cancel Subscription
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Wedding Timeline Tab */}
      {activeTab === 'wedding-timeline' && (
        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '5px', border: '1px solid #333', marginTop: '20px' }}>
          <h2 style={{ color: '#00ff00', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CalendarIcon style={{ width: '24px', height: '24px' }} />
            Wedding Timeline Management
          </h2>
          
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#222', borderRadius: '5px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>Select Wedding:</label>
            <select style={{ width: '100%', padding: '10px', backgroundColor: '#333', border: '1px solid #555', borderRadius: '5px', color: '#fff' }}>
              <option value="">All Weddings</option>
              {weddingContracts.map(contract => (
                <option key={contract.id} value={contract.id}>{contract.clientName} - {new Date(contract.weddingDate).toLocaleDateString()}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gap: '20px' }}>
            {weddingContracts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#ccc' }}>
                <CalendarIcon style={{ width: '48px', height: '48px', margin: '0 auto 20px', opacity: 0.5 }} />
                <p>No wedding timelines found</p>
              </div>
            ) : (
              weddingContracts.slice(0, 3).map((wedding) => (
                <div key={wedding.id} style={{ backgroundColor: '#222', padding: '20px', borderRadius: '5px', border: '1px solid #333' }}>
                  <h3 style={{ color: '#fff', marginBottom: '15px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <HeartIcon style={{ width: '20px', height: '20px', color: '#ff69b4' }} />
                    {wedding.clientName} Wedding Timeline
                  </h3>
                  
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {[
                      { phase: 'Contract Signed', status: 'completed', date: wedding.contractSignedAt, icon: DocumentIcon },
                      { phase: 'Deposit Received', status: 'completed', date: wedding.depositReceivedAt, icon: BanknotesIcon },
                      { phase: 'Pre-Wedding Meeting', status: 'pending', date: wedding.preMeetingScheduled, icon: UserIcon },
                      { phase: 'Wedding Day', status: 'upcoming', date: wedding.weddingDate, icon: HeartIcon },
                      { phase: 'Post-Production', status: 'upcoming', date: wedding.postProductionStart, icon: VideoCameraIcon },
                      { phase: 'Final Delivery', status: 'upcoming', date: wedding.estimatedDelivery, icon: GiftIcon },
                    ].map((milestone, index) => {
                      const IconComponent = milestone.icon
                      return (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px', backgroundColor: '#333', borderRadius: '5px' }}>
                          <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: milestone.status === 'completed' ? '#059669' : milestone.status === 'pending' ? '#D97706' : '#6B7280'
                          }}></div>
                          <IconComponent style={{ width: '20px', height: '20px', color: '#00ff00' }} />
                          <div style={{ flex: 1 }}>
                            <p style={{ color: '#fff', margin: 0, fontSize: '14px', fontWeight: '500' }}>{milestone.phase}</p>
                            <p style={{ color: '#ccc', margin: 0, fontSize: '12px' }}>
                              {milestone.date ? new Date(milestone.date).toLocaleDateString() : 'TBD'}
                            </p>
                          </div>
                          <div style={{
                            padding: '4px 8px',
                            borderRadius: '10px',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            backgroundColor: milestone.status === 'completed' ? '#059669' : milestone.status === 'pending' ? '#D97706' : '#6B7280',
                            color: '#fff'
                          }}>
                            {milestone.status.toUpperCase()}
                          </div>
                          {milestone.status === 'pending' && (
                            <button style={{ padding: '4px 8px', backgroundColor: '#0066cc', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '11px' }}>
                              Update
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  
                  <div style={{ marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button style={{ padding: '8px 16px', backgroundColor: '#0066cc', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
                      Edit Timeline
                    </button>
                    <button style={{ padding: '8px 16px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
                      Notify Client
                    </button>
                    <button style={{ padding: '8px 16px', backgroundColor: '#6B7280', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
                      Generate Report
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )})

      {activeTab === 'users' && (
        <div
          style={{
            backgroundColor: '#111',
            padding: '20px',
            borderRadius: '5px',
            border: '1px solid #333',
            marginTop: '20px',
          }}
        >
          <h2 style={{ color: '#00ff00', marginBottom: '20px' }}>
            Users Management
          </h2>
          <button
            onClick={() => setShowUserModal(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#00ff00',
              color: '#000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginBottom: '20px',
            }}
          >
            Create New User
          </button>
          <div style={{ display: 'grid', gap: '10px' }}>
            {users.map((user) => (
              <div
                key={user.id}
                style={{
                  backgroundColor: '#222',
                  padding: '15px',
                  borderRadius: '5px',
                  border: '1px solid #333',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <strong style={{ color: '#fff' }}>{user.name}</strong>
                  <p style={{ color: '#ccc', margin: '5px 0' }}>{user.email}</p>
                  <span style={{ color: '#00ff00' }}>{user.role}</span>
                </div>
                <div>
                  <button
                    onClick={() => handleEditUser(user)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#0066cc',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      marginRight: '10px',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#cc0000',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div
          style={{
            backgroundColor: '#111',
            padding: '20px',
            borderRadius: '5px',
            border: '1px solid #333',
            marginTop: '20px',
          }}
        >
          <h2 style={{ color: '#00ff00', marginBottom: '20px' }}>
            Projects Management
          </h2>
          <button
            onClick={() => setShowProjectModal(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#00ff00',
              color: '#000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginBottom: '20px',
            }}
          >
            Create New Project
          </button>
          <div style={{ display: 'grid', gap: '10px' }}>
            {projects.map((project) => (
              <div
                key={project.id}
                style={{
                  backgroundColor: '#222',
                  padding: '15px',
                  borderRadius: '5px',
                  border: '1px solid #333',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <strong style={{ color: '#fff' }}>{project.title}</strong>
                  <p style={{ color: '#ccc', margin: '5px 0' }}>
                    {project.description}
                  </p>
                  <span style={{ color: '#00ff00' }}>${project.budget}</span>
                </div>
                <div>
                  <button
                    onClick={() => handleEditProject(project)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#0066cc',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      marginRight: '10px',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#cc0000',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div
          style={{
            backgroundColor: '#111',
            padding: '20px',
            borderRadius: '5px',
            border: '1px solid #333',
            marginTop: '20px',
          }}
        >
          <h2 style={{ color: '#00ff00', marginBottom: '20px' }}>
            Content Management
          </h2>
          <p style={{ color: '#ccc' }}>
            Content management features coming soon...
          </p>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div
          style={{
            backgroundColor: '#111',
            padding: '20px',
            borderRadius: '5px',
            border: '1px solid #333',
            marginTop: '20px',
          }}
        >
          <h2 style={{ color: '#00ff00', marginBottom: '20px' }}>Analytics</h2>
          <AnalyticsDashboard />
        </div>
      )}

      {activeTab === 'reports' && (
        <div
          style={{
            backgroundColor: '#111',
            padding: '20px',
            borderRadius: '5px',
            border: '1px solid #333',
            marginTop: '20px',
          }}
        >
          <h2 style={{ color: '#00ff00', marginBottom: '20px' }}>Reports</h2>
          <p style={{ color: '#ccc' }}>Reports features coming soon...</p>
        </div>
      )}

      {activeTab === 'settings' && (
        <div
          style={{
            backgroundColor: '#111',
            padding: '20px',
            borderRadius: '5px',
            border: '1px solid #333',
            marginTop: '20px',
          }}
        >
          <h2 style={{ color: '#00ff00', marginBottom: '20px' }}>Settings</h2>
          <p style={{ color: '#ccc' }}>Settings features coming soon...</p>
        </div>
      )}

      {/* File Upload Modal */}
      {showFileUploadModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#111', padding: '30px', borderRadius: '10px', border: '1px solid #333', width: '90%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '20px', color: '#00ff00', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CloudArrowUpIcon style={{ width: '24px', height: '24px' }} />
              Upload Client Files
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault()
              // Handle file upload logic here
              setUploadingFile(false)
              setShowFileUploadModal(false)
              alert('Files uploaded successfully!')
            }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Select Client</label>
                <select required style={{ width: '100%', padding: '10px', backgroundColor: '#333', border: '1px solid #555', borderRadius: '5px', color: '#fff' }}>
                  <option value="">Choose client...</option>
                  <option value="sarah-michael">Sarah & Michael Johnson</option>
                  <option value="emily-david">Emily & David Rodriguez</option>
                </select>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>File Category</label>
                <select required style={{ width: '100%', padding: '10px', backgroundColor: '#333', border: '1px solid #555', borderRadius: '5px', color: '#fff' }}>
                  <option value="">Choose category...</option>
                  <option value="photos">Wedding Photos</option>
                  <option value="video">Wedding Video</option>
                  <option value="documents">Documents/Contracts</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Select Files</label>
                <input
                  type="file"
                  multiple
                  required
                  style={{ width: '100%', padding: '10px', backgroundColor: '#333', border: '1px solid #555', borderRadius: '5px', color: '#fff' }}
                />
                <p style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>Maximum file size: 500MB per file</p>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ccc', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ transform: 'scale(1.2)' }} />
                  Notify client when upload is complete
                </label>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  disabled={uploadingFile}
                  style={{ padding: '12px 20px', backgroundColor: uploadingFile ? '#666' : '#00ff00', color: uploadingFile ? '#ccc' : '#000', border: 'none', borderRadius: '5px', cursor: uploadingFile ? 'not-allowed' : 'pointer', fontWeight: 'bold', flex: 1 }}
                >
                  {uploadingFile ? 'Uploading...' : 'Upload Files'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowFileUploadModal(false)}
                  style={{ padding: '12px 20px', backgroundColor: '#666', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
