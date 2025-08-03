'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import {
  ShieldCheckIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  BellIcon,
  LogoutIcon,
  HomeIcon
} from '@heroicons/react/24/outline'

export default function AdminLayout({ children }) {
  const [adminUser, setAdminUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  const router = useRouter()

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = async () => {
    const adminToken = localStorage.getItem('adminToken')
    const adminUserData = localStorage.getItem('adminUser')

    if (!adminToken || !adminUserData) {
      router.push('/admin/login')
      return
    }

    try {
      // Verify token with server
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: adminToken }),
      })

      if (!response.ok) {
        throw new Error('Token verification failed')
      }

      const user = JSON.parse(adminUserData)
      setAdminUser(user)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Admin auth error:', error)
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminUser')
      router.push('/admin/login')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    router.push('/admin/login')
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Users', href: '/admin/users', icon: UsersIcon },
    { name: 'Projects', href: '/admin/projects', icon: DocumentTextIcon },
    { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
    { name: 'Media', href: '/admin/media', icon: PhotoIcon },
    { name: 'Settings', href: '/admin/settings', icon: CogIcon },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-white text-xl">Loading Admin Panel...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-primary flex">
      {/* Sidebar */}
      <div className="w-64 bg-black/20 backdrop-blur-sm border-r border-gray-800">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <ShieldCheckIcon className="w-8 h-8 text-accent" />
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          </div>
          
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = router.pathname === item.href
              
              return (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-accent text-primary' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </motion.a>
              )
            })}
          </nav>
        </div>

        {/* Admin Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                <ShieldCheckIcon className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">{adminUser?.username}</p>
                <p className="text-gray-400 text-xs">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
            >
              <LogoutIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-black/20 backdrop-blur-sm border-b border-gray-800">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Admin Dashboard</h2>
                <p className="text-gray-300 text-sm">Manage your website and users</p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-300 hover:text-white transition-colors">
                  <BellIcon className="w-6 h-6" />
                </button>
                <button className="px-4 py-2 bg-accent text-primary rounded-lg hover:bg-accent/90 transition-colors">
                  Quick Actions
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 