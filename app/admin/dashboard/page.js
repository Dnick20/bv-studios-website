'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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
    status: 'active'
  })
  
  const [projectForm, setProjectForm] = useState({
    title: '',
    client: '',
    budget: '',
    description: '',
    startDate: '',
    endDate: ''
  })
  
  // Edit states
  const [editingUser, setEditingUser] = useState(null)
  const [editingProject, setEditingProject] = useState(null)
  
  const router = useRouter()

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
      setAdminUser(user)
    } catch (error) {
      router.push('/admin')
      return
    }

    loadDashboardData()
    setIsLoading(false)
  }, [router])

  const loadDashboardData = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken')
      const headers = {
        'Content-Type': 'application/json',
        'x-admin-token': adminToken
      }

      // Load users
      const usersResponse = await fetch('/api/admin/users', { headers })
      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUsers(usersData.users)
      }

      // Load projects
      const projectsResponse = await fetch('/api/admin/projects', { headers })
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json()
        setProjects(projectsData.projects)
      }

      // Mock notifications
      setNotifications([
        { id: 1, message: 'New user registration: mike@example.com', type: 'info', time: '2 hours ago' },
        { id: 2, message: 'Project completed: Wedding Video - Sarah & Mike', type: 'success', time: '4 hours ago' },
        { id: 3, message: 'Payment received: $2,500 for Commercial Project', type: 'success', time: '6 hours ago' }
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
      const user = users.find(u => u.id === userId)
      setEditingUser(user)
      setUserForm({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      })
      setShowEditUserModal(true)
    } else if (action === 'delete') {
      if (confirm('Are you sure you want to delete this user?')) {
        try {
          const response = await fetch(`/api/admin/users?id=${userId}`, {
            method: 'DELETE'
          })
          
          if (response.ok) {
            setUsers(users.filter(u => u.id !== userId))
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
      const project = projects.find(p => p.id === projectId)
      setEditingProject(project)
      setProjectForm({
        title: project.title,
        client: project.client,
        budget: project.budget.toString(),
        description: project.description,
        startDate: project.startDate,
        endDate: project.endDate
      })
      setShowEditProjectModal(true)
    } else if (action === 'delete') {
      if (confirm('Are you sure you want to delete this project?')) {
        try {
          const response = await fetch(`/api/admin/projects?id=${projectId}`, {
            method: 'DELETE'
          })
          
          if (response.ok) {
            setProjects(projects.filter(p => p.id !== projectId))
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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userForm)
      })
      
      if (response.ok) {
        const data = await response.json()
        setUsers([...users, data.user])
        setShowUserModal(false)
        setUserForm({ name: '', email: '', role: 'client', status: 'active' })
        alert('User created successfully')
      } else {
        const error = await response.json()
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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectForm)
      })
      
      if (response.ok) {
        const data = await response.json()
        setProjects([...projects, data.project])
        setShowProjectModal(false)
        setProjectForm({ title: '', client: '', budget: '', description: '', startDate: '', endDate: '' })
        alert('Project created successfully')
      } else {
        const error = await response.json()
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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: editingUser.id,
          ...userForm
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setUsers(users.map(u => u.id === editingUser.id ? data.user : u))
        setShowEditUserModal(false)
        setEditingUser(null)
        setUserForm({ name: '', email: '', role: 'client', status: 'active' })
        alert('User updated successfully')
      } else {
        const error = await response.json()
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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: editingProject.id,
          ...projectForm
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setProjects(projects.map(p => p.id === editingProject.id ? data.project : p))
        setShowEditProjectModal(false)
        setEditingProject(null)
        setProjectForm({ title: '', client: '', budget: '', description: '', startDate: '', endDate: '' })
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
      <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    )
  }



  const renderOverview = () => (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
          <h3 style={{ marginBottom: '10px', color: '#00ff00' }}>Total Users</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{users.length}</p>
          <p style={{ color: '#ccc', fontSize: '14px' }}>+12% from last month</p>
        </div>

        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
          <h3 style={{ marginBottom: '10px', color: '#00ff00' }}>Active Projects</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{projects.length}</p>
          <p style={{ color: '#ccc', fontSize: '14px' }}>{projects.filter(p => p.status === 'pending').length} pending approval</p>
        </div>

        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
          <h3 style={{ marginBottom: '10px', color: '#00ff00' }}>Revenue</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>${projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}</p>
          <p style={{ color: '#ccc', fontSize: '14px' }}>This month</p>
        </div>

        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
          <h3 style={{ marginBottom: '10px', color: '#00ff00' }}>Completion Rate</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>85%</p>
          <p style={{ color: '#ccc', fontSize: '14px' }}>+5% from last month</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
          <h3 style={{ marginBottom: '20px', color: '#00ff00' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {notifications.map(notification => (
              <div key={notification.id} style={{ padding: '10px', backgroundColor: '#222', borderRadius: '5px' }}>
                <p><strong>{notification.message}</strong></p>
                <p style={{ color: '#ccc', fontSize: '12px' }}>{notification.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
          <h3 style={{ marginBottom: '20px', color: '#00ff00' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              onClick={() => handleTabChange('users')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#00ff00',
                color: '#000',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Manage Users
            </button>
            <button 
              onClick={() => handleTabChange('projects')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#0066ff',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Manage Projects
            </button>
            <button 
              onClick={() => handleTabChange('content')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#ff6600',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Manage Content
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderUsers = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#00ff00' }}>User Management</h2>
        <button 
          onClick={() => {
            console.log('Add New User button clicked!')
            setShowUserModal(true)
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#00ff00',
            color: '#000',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Add New User
        </button>
      </div>
      
      <div style={{ backgroundColor: '#111', borderRadius: '10px', border: '1px solid #333', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#222' }}>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #333' }}>Name</th>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #333' }}>Email</th>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #333' }}>Status</th>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #333' }}>Projects</th>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #333' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #333' }}>
                <td style={{ padding: '15px' }}>{user.name}</td>
                <td style={{ padding: '15px' }}>{user.email}</td>
                <td style={{ padding: '15px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '3px',
                    fontSize: '12px',
                    backgroundColor: user.status === 'active' ? '#00ff00' : '#ffaa00',
                    color: user.status === 'active' ? '#000' : '#fff'
                  }}>
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: '15px' }}>{user.projects}</td>
                <td style={{ padding: '15px' }}>
                  <button 
                    onClick={() => handleUserAction('edit', user.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#0066ff',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      marginRight: '5px'
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleUserAction('delete', user.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#ff4444',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderProjects = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#00ff00' }}>Project Management</h2>
        <button 
          onClick={() => {
            console.log('Create New Project button clicked!')
            setShowProjectModal(true)
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#00ff00',
            color: '#000',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Create New Project
        </button>
      </div>
      
      <div style={{ backgroundColor: '#111', borderRadius: '10px', border: '1px solid #333', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#222' }}>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #333' }}>Project</th>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #333' }}>Client</th>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #333' }}>Status</th>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #333' }}>Budget</th>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #333' }}>Progress</th>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #333' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <tr key={project.id} style={{ borderBottom: '1px solid #333' }}>
                <td style={{ padding: '15px' }}>{project.title}</td>
                <td style={{ padding: '15px' }}>{project.client}</td>
                <td style={{ padding: '15px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '3px',
                    fontSize: '12px',
                    backgroundColor: 
                      project.status === 'completed' ? '#00ff00' :
                      project.status === 'in-progress' ? '#0066ff' : '#ffaa00',
                    color: project.status === 'completed' ? '#000' : '#fff'
                  }}>
                    {project.status}
                  </span>
                </td>
                <td style={{ padding: '15px' }}>${project.budget.toLocaleString()}</td>
                <td style={{ padding: '15px' }}>
                  <div style={{ width: '100%', backgroundColor: '#333', borderRadius: '10px', height: '10px' }}>
                    <div style={{
                      width: `${project.progress}%`,
                      backgroundColor: '#00ff00',
                      height: '100%',
                      borderRadius: '10px'
                    }}></div>
                  </div>
                  <span style={{ fontSize: '12px', color: '#ccc' }}>{project.progress}%</span>
                </td>
                <td style={{ padding: '15px' }}>
                  <button 
                    onClick={() => handleProjectAction('edit', project.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#0066ff',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      marginRight: '5px'
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleProjectAction('delete', project.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#ff4444',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderContent = () => (
    <div>
      <h2 style={{ color: '#00ff00', marginBottom: '20px' }}>Content Management</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
          <h3 style={{ marginBottom: '15px', color: '#00ff00' }}>Website Pages</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              onClick={() => handleContentManagement('homepage')}
              style={{
                padding: '10px',
                backgroundColor: '#333',
                color: '#fff',
                border: '1px solid #555',
                borderRadius: '5px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              Homepage Content
            </button>
            <button 
              onClick={() => handleContentManagement('wedding')}
              style={{
                padding: '10px',
                backgroundColor: '#333',
                color: '#fff',
                border: '1px solid #555',
                borderRadius: '5px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              Wedding Page
            </button>
            <button 
              onClick={() => handleContentManagement('portfolio')}
              style={{
                padding: '10px',
                backgroundColor: '#333',
                color: '#fff',
                border: '1px solid #555',
                borderRadius: '5px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              Portfolio Gallery
            </button>
          </div>
        </div>

        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
          <h3 style={{ marginBottom: '15px', color: '#00ff00' }}>Media Management</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              onClick={() => handleMediaManagement('upload-images')}
              style={{
                padding: '10px',
                backgroundColor: '#333',
                color: '#fff',
                border: '1px solid #555',
                borderRadius: '5px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              Upload Images
            </button>
            <button 
              onClick={() => handleMediaManagement('manage-videos')}
              style={{
                padding: '10px',
                backgroundColor: '#333',
                color: '#fff',
                border: '1px solid #555',
                borderRadius: '5px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              Manage Videos
            </button>
            <button 
              onClick={() => handleMediaManagement('seo-settings')}
              style={{
                padding: '10px',
                backgroundColor: '#333',
                color: '#fff',
                border: '1px solid #555',
                borderRadius: '5px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              SEO Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAnalytics = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#00ff00' }}>Analytics & Reports</h2>
        <button 
          onClick={() => {
            console.log('View Detailed Reports button clicked!')
            setActiveTab('reports')
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#00ff00',
            color: '#000',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          View Detailed Reports
        </button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
          <h3 style={{ marginBottom: '15px', color: '#00ff00' }}>Revenue Analytics</h3>
          <div style={{ height: '200px', backgroundColor: '#222', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <p style={{ color: '#ccc', fontSize: '2rem', fontWeight: 'bold', margin: '0 0 10px 0' }}>${projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}</p>
            <p style={{ color: '#00ff00', fontSize: '14px' }}>Total Revenue</p>
          </div>
          <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#ccc', fontSize: '12px' }}>This Month</p>
              <p style={{ color: '#00ff00', fontSize: '16px', fontWeight: 'bold' }}>+23.5%</p>
            </div>
            <div>
              <p style={{ color: '#ccc', fontSize: '12px' }}>Last Month</p>
              <p style={{ color: '#ffaa00', fontSize: '16px', fontWeight: 'bold' }}>+18.2%</p>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
          <h3 style={{ marginBottom: '15px', color: '#00ff00' }}>Project Performance</h3>
          <div style={{ height: '200px', backgroundColor: '#222', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <p style={{ color: '#ccc', fontSize: '2rem', fontWeight: 'bold', margin: '0 0 10px 0' }}>{projects.length}</p>
            <p style={{ color: '#00ff00', fontSize: '14px' }}>Active Projects</p>
          </div>
          <div style={{ marginTop: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ color: '#ccc', fontSize: '12px' }}>Completed</span>
              <span style={{ color: '#00ff00', fontSize: '12px' }}>{projects.filter(p => p.status === 'completed').length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ color: '#ccc', fontSize: '12px' }}>In Progress</span>
              <span style={{ color: '#0066ff', fontSize: '12px' }}>{projects.filter(p => p.status === 'in-progress').length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#ccc', fontSize: '12px' }}>Pending</span>
              <span style={{ color: '#ffaa00', fontSize: '12px' }}>{projects.filter(p => p.status === 'pending').length}</span>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
          <h3 style={{ marginBottom: '15px', color: '#00ff00' }}>User Growth</h3>
          <div style={{ height: '200px', backgroundColor: '#222', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <p style={{ color: '#ccc', fontSize: '2rem', fontWeight: 'bold', margin: '0 0 10px 0' }}>{users.length}</p>
            <p style={{ color: '#00ff00', fontSize: '14px' }}>Total Users</p>
          </div>
          <div style={{ marginTop: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ color: '#ccc', fontSize: '12px' }}>Active</span>
              <span style={{ color: '#00ff00', fontSize: '12px' }}>{users.filter(u => u.status === 'active').length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#ccc', fontSize: '12px' }}>Pending</span>
              <span style={{ color: '#ffaa00', fontSize: '12px' }}>{users.filter(u => u.status === 'pending').length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Reports Section */}
      <div style={{ marginTop: '30px' }}>
        <h3 style={{ color: '#00ff00', marginBottom: '20px' }}>Quick Reports</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          <button 
            onClick={() => generateReport('revenue')}
            style={{
              padding: '15px',
              backgroundColor: '#111',
              border: '1px solid #333',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#222'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#111'}
          >
            <h4 style={{ color: '#00ff00', margin: '0 0 10px 0' }}>Revenue Report</h4>
            <p style={{ color: '#ccc', fontSize: '12px', margin: '0' }}>Monthly revenue breakdown and trends</p>
          </button>

          <button 
            onClick={() => generateReport('projects')}
            style={{
              padding: '15px',
              backgroundColor: '#111',
              border: '1px solid #333',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#222'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#111'}
          >
            <h4 style={{ color: '#00ff00', margin: '0 0 10px 0' }}>Project Report</h4>
            <p style={{ color: '#ccc', fontSize: '12px', margin: '0' }}>Project status and completion rates</p>
          </button>

          <button 
            onClick={() => generateReport('users')}
            style={{
              padding: '15px',
              backgroundColor: '#111',
              border: '1px solid #333',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#222'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#111'}
          >
            <h4 style={{ color: '#00ff00', margin: '0 0 10px 0' }}>User Report</h4>
            <p style={{ color: '#ccc', fontSize: '12px', margin: '0' }}>User growth and activity metrics</p>
          </button>

          <button 
            onClick={() => generateReport('performance')}
            style={{
              padding: '15px',
              backgroundColor: '#111',
              border: '1px solid #333',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#222'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#111'}
          >
            <h4 style={{ color: '#00ff00', margin: '0 0 10px 0' }}>Performance Report</h4>
            <p style={{ color: '#ccc', fontSize: '12px', margin: '0' }}>Business performance metrics</p>
          </button>
        </div>
      </div>
    </div>
  )

  const renderReports = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#00ff00' }}>Detailed Reports</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => exportReport('pdf')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ff4444',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Export PDF
          </button>
          <button 
            onClick={() => exportReport('csv')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#00ff00',
              color: '#000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Revenue Report */}
      <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333', marginBottom: '20px' }}>
        <h3 style={{ color: '#00ff00', marginBottom: '20px' }}>Revenue Analysis</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#ccc', fontSize: '12px' }}>Total Revenue</p>
            <p style={{ color: '#00ff00', fontSize: '2rem', fontWeight: 'bold' }}>${projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#ccc', fontSize: '12px' }}>Average Project Value</p>
            <p style={{ color: '#00ff00', fontSize: '2rem', fontWeight: 'bold' }}>${Math.round(projects.reduce((sum, p) => sum + p.budget, 0) / projects.length).toLocaleString()}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#ccc', fontSize: '12px' }}>Monthly Growth</p>
            <p style={{ color: '#00ff00', fontSize: '2rem', fontWeight: 'bold' }}>+23.5%</p>
          </div>
        </div>
        
        <div style={{ backgroundColor: '#222', padding: '15px', borderRadius: '5px' }}>
          <h4 style={{ color: '#00ff00', marginBottom: '15px' }}>Revenue by Project Type</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#ccc' }}>Wedding Videos</span>
              <span style={{ color: '#00ff00', fontWeight: 'bold' }}>${projects.filter(p => p.title.includes('Wedding')).reduce((sum, p) => sum + p.budget, 0).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#ccc' }}>Commercial Projects</span>
              <span style={{ color: '#00ff00', fontWeight: 'bold' }}>${projects.filter(p => p.title.includes('Commercial')).reduce((sum, p) => sum + p.budget, 0).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#ccc' }}>Event Coverage</span>
              <span style={{ color: '#00ff00', fontWeight: 'bold' }}>${projects.filter(p => p.title.includes('Event')).reduce((sum, p) => sum + p.budget, 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Project Performance Report */}
      <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333', marginBottom: '20px' }}>
        <h3 style={{ color: '#00ff00', marginBottom: '20px' }}>Project Performance</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#ccc', fontSize: '12px' }}>Total Projects</p>
            <p style={{ color: '#00ff00', fontSize: '2rem', fontWeight: 'bold' }}>{projects.length}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#ccc', fontSize: '12px' }}>Completion Rate</p>
            <p style={{ color: '#00ff00', fontSize: '2rem', fontWeight: 'bold' }}>{Math.round((projects.filter(p => p.status === 'completed').length / projects.length) * 100)}%</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#ccc', fontSize: '12px' }}>Avg. Project Duration</p>
            <p style={{ color: '#00ff00', fontSize: '2rem', fontWeight: 'bold' }}>45 days</p>
          </div>
        </div>

        <div style={{ backgroundColor: '#222', padding: '15px', borderRadius: '5px' }}>
          <h4 style={{ color: '#00ff00', marginBottom: '15px' }}>Project Status Breakdown</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#ccc' }}>Completed</span>
              <span style={{ color: '#00ff00', fontWeight: 'bold' }}>{projects.filter(p => p.status === 'completed').length} projects</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#ccc' }}>In Progress</span>
              <span style={{ color: '#0066ff', fontWeight: 'bold' }}>{projects.filter(p => p.status === 'in-progress').length} projects</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#ccc' }}>Pending</span>
              <span style={{ color: '#ffaa00', fontWeight: 'bold' }}>{projects.filter(p => p.status === 'pending').length} projects</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Analytics Report */}
      <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
        <h3 style={{ color: '#00ff00', marginBottom: '20px' }}>User Analytics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#ccc', fontSize: '12px' }}>Total Users</p>
            <p style={{ color: '#00ff00', fontSize: '2rem', fontWeight: 'bold' }}>{users.length}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#ccc', fontSize: '12px' }}>Active Users</p>
            <p style={{ color: '#00ff00', fontSize: '2rem', fontWeight: 'bold' }}>{users.filter(u => u.status === 'active').length}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#ccc', fontSize: '12px' }}>Growth Rate</p>
            <p style={{ color: '#00ff00', fontSize: '2rem', fontWeight: 'bold' }}>+18.5%</p>
          </div>
        </div>

        <div style={{ backgroundColor: '#222', padding: '15px', borderRadius: '5px' }}>
          <h4 style={{ color: '#00ff00', marginBottom: '15px' }}>User Activity</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#ccc' }}>Users with Projects</span>
              <span style={{ color: '#00ff00', fontWeight: 'bold' }}>{users.filter(u => u.projects > 0).length} users</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#ccc' }}>New This Month</span>
              <span style={{ color: '#00ff00', fontWeight: 'bold' }}>23 users</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#ccc' }}>Average Projects per User</span>
              <span style={{ color: '#00ff00', fontWeight: 'bold' }}>{(projects.length / users.length).toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const generateReport = (type) => {
    
    // In a real application, this would call the analytics API
    console.log(`Generating ${type} report...`)
    
    // Mock report generation
    const reportData = {
      revenue: {
        total: projects.reduce((sum, p) => sum + p.budget, 0),
        monthly: [12500, 18750, 15600, 22300, 19800, 24500],
        growth: 23.5
      },
      projects: {
        total: projects.length,
        completed: projects.filter(p => p.status === 'completed').length,
        inProgress: projects.filter(p => p.status === 'in-progress').length,
        pending: projects.filter(p => p.status === 'pending').length
      },
      users: {
        total: users.length,
        active: users.filter(u => u.status === 'active').length,
        growth: 18.5
      }
    }
    
    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} report generated successfully!`)
  }

  const exportReport = async (format) => {
    try {
      // Create report data
      const data = {
        revenue: projects.reduce((sum, p) => sum + p.budget, 0),
        projects: projects.length,
        users: users.length,
        timestamp: new Date().toISOString()
      }
      
      if (format === 'pdf') {
        // In a real app, this would generate and download a PDF
        const response = await fetch('/api/admin/export/pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        
        if (response.ok) {
          const blob = await response.blob()
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `admin-report-${new Date().toISOString().split('T')[0]}.pdf`
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
        } else {
          alert('PDF export failed. Please try again.')
        }
      } else if (format === 'csv') {
        // Generate CSV
        const csvContent = `Revenue,Projects,Users,Timestamp\n${data.revenue},${data.projects},${data.users},${data.timestamp}`
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `admin-report-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('Export failed. Please try again.')
    }
  }

  const handleChangePassword = async () => {
    const newPassword = prompt('Enter new password:')
    if (!newPassword) return
    
    const confirmPassword = prompt('Confirm new password:')
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    
    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newPassword })
      })
      
      if (response.ok) {
        alert('Password changed successfully!')
      } else {
        alert('Failed to change password. Please try again.')
      }
    } catch (error) {
      console.error('Password change error:', error)
      alert('Failed to change password. Please try again.')
    }
  }

  const handleEnable2FA = async () => {
    try {
      const response = await fetch('/api/admin/enable-2fa', {
        method: 'POST'
      })
      
      if (response.ok) {
        const data = await response.json()
        alert(`2FA enabled! QR Code: ${data.qrCode}`)
      } else {
        alert('Failed to enable 2FA. Please try again.')
      }
    } catch (error) {
      console.error('2FA error:', error)
      alert('Failed to enable 2FA. Please try again.')
    }
  }

  const handleBackupDatabase = async () => {
    try {
      const response = await fetch('/api/admin/backup-database', {
        method: 'POST'
      })
      
      if (response.ok) {
        const data = await response.json()
        alert(`Database backup created successfully! Backup ID: ${data.backupId}`)
      } else {
        alert('Failed to create backup. Please try again.')
      }
    } catch (error) {
      console.error('Backup error:', error)
      alert('Failed to create backup. Please try again.')
    }
  }

  const handleClearCache = async () => {
    try {
      const response = await fetch('/api/admin/clear-cache', {
        method: 'POST'
      })
      
      if (response.ok) {
        alert('Cache cleared successfully!')
        // Reload dashboard data
        loadDashboardData()
      } else {
        alert('Failed to clear cache. Please try again.')
      }
    } catch (error) {
      console.error('Cache clear error:', error)
      alert('Failed to clear cache. Please try again.')
    }
  }

  const handleContentManagement = (type) => {
    switch (type) {
      case 'homepage':
        router.push('/admin/content/homepage')
        break
      case 'wedding':
        router.push('/admin/content/wedding')
        break
      case 'portfolio':
        router.push('/admin/content/portfolio')
        break
      default:
        alert('Content management feature coming soon!')
    }
  }

  const handleMediaManagement = (type) => {
    switch (type) {
      case 'upload-images':
        router.push('/admin/media/upload-images')
        break
      case 'manage-videos':
        router.push('/admin/media/manage-videos')
        break
      case 'seo-settings':
        router.push('/admin/media/seo-settings')
        break
      default:
        alert('Media management feature coming soon!')
    }
  }

  const renderSettings = () => (
    <div>
      <h2 style={{ color: '#00ff00', marginBottom: '20px' }}>Admin Settings</h2>
      <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '10px', color: '#00ff00' }}>Profile Settings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Admin Username</label>
              <input 
                type="text" 
                defaultValue={adminUser?.username || 'admin'}
                style={{ width: '100%', padding: '10px', backgroundColor: '#333', border: '1px solid #555', borderRadius: '5px', color: '#fff' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
              <input 
                type="email" 
                defaultValue={adminUser?.email || 'admin@example.com'}
                style={{ width: '100%', padding: '10px', backgroundColor: '#333', border: '1px solid #555', borderRadius: '5px', color: '#fff' }}
              />
            </div>
            <button style={{
              padding: '10px 20px',
              backgroundColor: '#00ff00',
              color: '#000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              Update Profile
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '10px', color: '#00ff00' }}>Security Settings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              onClick={handleChangePassword}
              style={{
                padding: '10px 20px',
                backgroundColor: '#0066ff',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Change Password
            </button>
            <button 
              onClick={handleEnable2FA}
              style={{
                padding: '10px 20px',
                backgroundColor: '#ffaa00',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Enable 2FA
            </button>
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: '10px', color: '#00ff00' }}>System Settings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              onClick={handleBackupDatabase}
              style={{
                padding: '10px 20px',
                backgroundColor: '#ff6600',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Backup Database
            </button>
            <button 
              onClick={handleClearCache}
              style={{
                padding: '10px 20px',
                backgroundColor: '#ff4444',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Clear Cache
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff' }}>
      {/* Header */}
      <div style={{ padding: '20px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Admin Dashboard</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span>Welcome, {adminUser?.username || 'Admin'}</span>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ff4444',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ padding: '20px 20px 0 20px' }}>
        <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #333' }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'users', label: 'Users' },
            { id: 'projects', label: 'Projects' },
            { id: 'content', label: 'Content' },
            { id: 'analytics', label: 'Analytics' },
            { id: 'reports', label: 'Reports' },
            { id: 'settings', label: 'Settings' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              style={{
                padding: '10px 20px',
                backgroundColor: activeTab === tab.id ? '#00ff00' : 'transparent',
                color: activeTab === tab.id ? '#000' : '#fff',
                border: 'none',
                borderRadius: '5px 5px 0 0',
                cursor: 'pointer',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal'
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
        <div style={{ 
          backgroundColor: '#111', 
          padding: '15px', 
          borderRadius: '5px', 
          marginBottom: '20px',
          border: '1px solid #333'
        }}>
          <h3 style={{ color: '#00ff00', marginBottom: '10px' }}>Debug Info</h3>
          <p style={{ color: '#ccc', fontSize: '12px' }}>showUserModal: {showUserModal ? 'true' : 'false'}</p>
          <p style={{ color: '#ccc', fontSize: '12px' }}>showProjectModal: {showProjectModal ? 'true' : 'false'}</p>
          <p style={{ color: '#ccc', fontSize: '12px' }}>activeTab: {activeTab}</p>
          <p style={{ color: '#ccc', fontSize: '12px' }}>Users count: {users.length}</p>
          <p style={{ color: '#ccc', fontSize: '12px' }}>Projects count: {projects.length}</p>
        </div>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'projects' && renderProjects()}
        {activeTab === 'content' && renderContent()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'reports' && renderReports()}
        {activeTab === 'settings' && renderSettings()}
      </div>

      {/* User Modal */}
      {console.log('showUserModal state:', showUserModal)}
      {showUserModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#111',
            padding: '30px',
            borderRadius: '10px',
            border: '1px solid #333',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h2 style={{ color: '#00ff00', marginBottom: '20px' }}>Add New User</h2>
            <form onSubmit={handleCreateUser}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Name</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                  required
                  style={{ width: '100%', padding: '10px', backgroundColor: '#333', border: '1px solid #555', borderRadius: '5px', color: '#fff' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  required
                  style={{ width: '100%', padding: '10px', backgroundColor: '#333', border: '1px solid #555', borderRadius: '5px', color: '#fff' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Role</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                  style={{ width: '100%', padding: '10px', backgroundColor: '#333', border: '1px solid #555', borderRadius: '5px', color: '#fff' }}
                >
                  <option value="client">Client</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Status</label>
                <select
                  value={userForm.status}
                  onChange={(e) => setUserForm({...userForm, status: e.target.value})}
                  style={{ width: '100%', padding: '10px', backgroundColor: '#333', border: '1px solid #555', borderRadius: '5px', color: '#fff' }}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
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
                    fontWeight: 'bold'
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
                    cursor: 'pointer'
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
      {console.log('showEditUserModal state:', showEditUserModal)}
      {showEditUserModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#111',
            padding: '30px',
            borderRadius: '10px',
            border: '1px solid #333',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h2 style={{ color: '#00ff00', marginBottom: '20px' }}>Edit User</h2>
            <form onSubmit={handleUpdateUser}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Name</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                  required
                  style={{ width: '100%', padding: '10px', backgroundColor: '#333', border: '1px solid #555', borderRadius: '5px', color: '#fff' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  required
                  style={{ width: '100%', padding: '10px', backgroundColor: '#333', border: '1px solid #555', borderRadius: '5px', color: '#fff' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Role</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                  style={{ width: '100%', padding: '10px', backgroundColor: '#333', border: '1px solid #555', borderRadius: '5px', color: '#fff' }}
                >
                  <option value="client">Client</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Status</label>
                <select
                  value={userForm.status}
                  onChange={(e) => setUserForm({...userForm, status: e.target.value})}
                  style={{ width: '100%', padding: '10px', backgroundColor: '#333', border: '1px solid #555', borderRadius: '5px', color: '#fff' }}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
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
                    fontWeight: 'bold'
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
                    cursor: 'pointer'
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
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#111',
            padding: '30px',
            borderRadius: '10px',
            border: '1px solid #333',
            width: '90%',
            maxWidth: '600px'
          }}>
            <h2 style={{ color: '#00ff00', marginBottom: '20px' }}>Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Project Title</label>
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                    required
                    style={{ width: '100%', padding: '10px', backgroundColor: '#333', border: '1px solid #555', borderRadius: '5px', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Client</label>
                  <input
                    type="text"
                    value={projectForm.client}
                    onChange={(e) => setProjectForm({...projectForm, client: e.target.value})}
                    required
                    style={{ width: '100%', padding: '10px', backgroundColor: '#333', border: '1px solid #555', borderRadius: '5px', color: '#fff' }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Budget</label>
                  <input
                    type="number"
                    value={projectForm.budget}
                    onChange={(e) => setProjectForm({...projectForm, budget: e.target.value})}
                    required
                    style={{ width: '100%', padding: '10px', backgroundColor: '#333', border: '1px solid #555', borderRadius: '5px', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Start Date</label>
                  <input
                    type="date"
                    value={projectForm.startDate}
                    onChange={(e) => setProjectForm({...projectForm, startDate: e.target.value})}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#333', border: '1px solid #555', borderRadius: '5px', color: '#fff' }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>End Date</label>
                <input
                  type="date"
                  value={projectForm.endDate}
                  onChange={(e) => setProjectForm({...projectForm, endDate: e.target.value})}
                  style={{ width: '100%', padding: '10px', backgroundColor: '#333', border: '1px solid #555', borderRadius: '5px', color: '#fff' }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                  rows="3"
                  style={{ width: '100%', padding: '10px', backgroundColor: '#333', border: '1px solid #555', borderRadius: '5px', color: '#fff' }}
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
                    fontWeight: 'bold'
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
                    cursor: 'pointer'
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
      {showEditProjectModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#111',
            padding: '30px',
            borderRadius: '10px',
            border: '1px solid #333',
            width: '90%',
            maxWidth: '600px'
          }}>
            <h2 style={{ color: '#00ff00', marginBottom: '20px' }}>Edit Project</h2>
            <form onSubmit={handleUpdateProject}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Project Title</label>
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                    required
                    style={{ width: '100%', padding: '10px', backgroundColor: '#333', border: '1px solid #555', borderRadius: '5px', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Client</label>
                  <input
                    type="text"
                    value={projectForm.client}
                    onChange={(e) => setProjectForm({...projectForm, client: e.target.value})}
                    required
                    style={{ width: '100%', padding: '10px', backgroundColor: '#333', border: '1px solid #555', borderRadius: '5px', color: '#fff' }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Budget</label>
                  <input
                    type="number"
                    value={projectForm.budget}
                    onChange={(e) => setProjectForm({...projectForm, budget: e.target.value})}
                    required
                    style={{ width: '100%', padding: '10px', backgroundColor: '#333', border: '1px solid #555', borderRadius: '5px', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Start Date</label>
                  <input
                    type="date"
                    value={projectForm.startDate}
                    onChange={(e) => setProjectForm({...projectForm, startDate: e.target.value})}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#333', border: '1px solid #555', borderRadius: '5px', color: '#fff' }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>End Date</label>
                <input
                  type="date"
                  value={projectForm.endDate}
                  onChange={(e) => setProjectForm({...projectForm, endDate: e.target.value})}
                  style={{ width: '100%', padding: '10px', backgroundColor: '#333', border: '1px solid #555', borderRadius: '5px', color: '#fff' }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                  rows="3"
                  style={{ width: '100%', padding: '10px', backgroundColor: '#333', border: '1px solid #555', borderRadius: '5px', color: '#fff' }}
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
                    fontWeight: 'bold'
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
                    cursor: 'pointer'
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