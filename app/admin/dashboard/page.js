'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AnalyticsDashboard from '../../../components/AnalyticsDashboard'
import WeddingQuoteManager from '../../../components/WeddingQuoteManager'
import { analytics } from '../../../lib/analytics'
import { safeFetchJson, safeJson } from '../../../lib/utils/safeJson'

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
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
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

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'projects' && renderProjects()}
        {activeTab === 'content' && renderContent()}
        {activeTab === 'bots' && renderBots()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'reports' && renderReports()}
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
        {activeTab === 'settings' && renderSettings()}
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
    </div>
  )
}
