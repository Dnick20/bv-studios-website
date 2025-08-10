'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Admin() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      // Store admin token in localStorage and cookie
      const token = data.token || '1'
      localStorage.setItem('adminToken', token)
      localStorage.setItem('adminUser', JSON.stringify(data.user))
      document.cookie = `adminToken=${token}; path=/`

      // Redirect to admin dashboard
      router.push('/admin/dashboard')
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

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
      <div style={{ maxWidth: '400px', width: '100%', padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '10px',
            }}
          >
            Admin Access
          </h1>
          <p style={{ color: '#ccc' }}>Enter your admin credentials</p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
        >
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#333',
                border: '1px solid #555',
                borderRadius: '5px',
                color: '#fff',
              }}
              placeholder="Enter admin username"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#333',
                border: '1px solid #555',
                borderRadius: '5px',
                color: '#fff',
              }}
              placeholder="Enter admin password"
            />
          </div>

          {error && (
            <div
              style={{
                padding: '10px',
                backgroundColor: 'rgba(255,0,0,0.2)',
                border: '1px solid #f00',
                borderRadius: '5px',
                color: '#ff6b6b',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#00ff00',
              color: '#000',
              border: 'none',
              borderRadius: '5px',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1,
            }}
          >
            {isLoading ? 'Authenticating...' : 'Access Admin Dashboard'}
          </button>
        </form>

        {/* Credentials hint removed */}
      </div>
    </div>
  )
}
