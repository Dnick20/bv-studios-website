'use client'

import { useState } from 'react'

export default function TestButtons() {
  const [showUserModal, setShowUserModal] = useState(false)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const handleUserModal = () => {
    console.log('Add New User button clicked!')
    setShowUserModal(true)
  }

  const handleProjectModal = () => {
    console.log('Create New Project button clicked!')
    setShowProjectModal(true)
  }

  const handleReportsTab = () => {
    console.log('View Reports button clicked!')
    setActiveTab('reports')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', padding: '20px' }}>
      <h1 style={{ color: '#00ff00', marginBottom: '30px' }}>Button Functionality Test</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#00ff00', marginBottom: '15px' }}>Test Buttons</h2>
        
        <button 
          onClick={handleUserModal}
          style={{
            padding: '10px 20px',
            backgroundColor: '#00ff00',
            color: '#000',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginRight: '10px'
          }}
        >
          Add New User
        </button>

        <button 
          onClick={handleProjectModal}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0066ff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginRight: '10px'
          }}
        >
          Create New Project
        </button>

        <button 
          onClick={handleReportsTab}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ff6600',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          View Reports
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#00ff00', marginBottom: '15px' }}>Current State</h2>
        <p>showUserModal: {showUserModal ? 'true' : 'false'}</p>
        <p>showProjectModal: {showProjectModal ? 'true' : 'false'}</p>
        <p>activeTab: {activeTab}</p>
      </div>

      {/* User Modal */}
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
            <h2 style={{ color: '#00ff00', marginBottom: '20px' }}>Add New User (Test)</h2>
            <p style={{ color: '#ccc', marginBottom: '20px' }}>This is a test modal to verify functionality.</p>
            <button
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
              Close Modal
            </button>
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
            maxWidth: '500px'
          }}>
            <h2 style={{ color: '#00ff00', marginBottom: '20px' }}>Create New Project (Test)</h2>
            <p style={{ color: '#ccc', marginBottom: '20px' }}>This is a test modal to verify functionality.</p>
            <button
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
              Close Modal
            </button>
          </div>
        </div>
      )}

      <div style={{ marginTop: '30px' }}>
        <h2 style={{ color: '#00ff00', marginBottom: '15px' }}>Instructions</h2>
        <ol style={{ color: '#ccc' }}>
          <li>Click each button above</li>
          <li>Check the browser console for log messages</li>
          <li>Verify that modals open and close properly</li>
          <li>Check that the state values update correctly</li>
        </ol>
      </div>
    </div>
  )
} 