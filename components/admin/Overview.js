'use client'

export default function Overview({ users, projects, notifications, handleTabChange }) {
  const totalRevenue = projects.reduce((sum, p) => sum + p.budget, 0)
  const pendingProjects = projects.filter(p => p.status === 'pending').length

  return (
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
          <p style={{ color: '#ccc', fontSize: '14px' }}>{pendingProjects} pending approval</p>
        </div>

        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
          <h3 style={{ marginBottom: '10px', color: '#00ff00' }}>Revenue</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>${totalRevenue.toLocaleString()}</p>
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
} 