'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navigation from '../../components/Navigation.js'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    status: 'trial',
    daysLeft: 45
  })
  const [recentActivity, setRecentActivity] = useState([
    { message: 'Welcome to BV Studios!', timestamp: new Date() },
    { message: 'Your account has been created', timestamp: new Date(Date.now() - 86400000) }
  ])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

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

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'projects', name: 'Projects', icon: '🎬' },
    { id: 'quotes', name: 'Quotes', icon: '💰' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ]

  return (
    <div className="min-h-screen bg-primary">
      <Navigation />
      
      <div className="pt-20 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back, {session.user?.name || 'User'}!
            </h1>
            <p className="text-gray-300 text-lg">
              Manage your video production projects and quotes
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-black/20 rounded-lg p-1 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-accent text-primary'
                    : 'text-gray-300 hover:text-white hover:bg-black/30'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-black/20 rounded-lg p-6 border border-gray-800">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h2>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-black/30 rounded-lg p-6 border border-gray-700">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <span className="text-2xl">🎬</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-gray-400 text-sm">Active Projects</p>
                        <p className="text-2xl font-bold text-white">3</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-6 border border-gray-700">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <span className="text-2xl">💰</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-gray-400 text-sm">Pending Quotes</p>
                        <p className="text-2xl font-bold text-white">2</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-6 border border-gray-700">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <span className="text-2xl">📅</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-gray-400 text-sm">Upcoming Events</p>
                        <p className="text-2xl font-bold text-white">1</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subscription Status */}
                {subscriptionStatus && (
                  <div className="bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-lg p-6 border border-blue-500/30 mb-6">
                    <h3 className="text-lg font-bold text-white mb-4">Access Status</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Current Plan</span>
                        <span className="text-white font-medium">
                          {subscriptionStatus.status === 'trial' ? 'Free Trial' : 'Premium'}
                        </span>
                      </div>
                      {subscriptionStatus.status === 'trial' && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Days Remaining</span>
                            <span className="text-green-400 font-bold">
                              {subscriptionStatus.daysLeft}
                            </span>
                          </div>
                          <div className="bg-black/20 rounded-full h-2">
                            <div 
                              className="bg-green-400 h-2 rounded-full"
                              style={{ width: `${(subscriptionStatus.daysLeft / 60) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-400">
                            Continue for $10/month after trial
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Recent Activity */}
                <div className="bg-black/30 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <p className="text-gray-300 text-sm">
                          {activity.message}
                        </p>
                        <span className="text-gray-500 text-xs ml-auto">
                          {activity.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'projects' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Your Projects</h2>
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">🎬</span>
                  <p className="text-gray-400 mb-4">No projects yet</p>
                  <button className="px-6 py-3 bg-accent text-primary rounded-lg hover:bg-accent/90 transition-colors font-medium">
                    Start Your First Project
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'quotes' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Your Quotes</h2>
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">💰</span>
                  <p className="text-gray-400 mb-4">No quotes yet</p>
                  <button className="px-6 py-3 bg-accent text-primary rounded-lg hover:bg-accent/90 transition-colors font-medium">
                    Request a Quote
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>
                <div className="space-y-6">
                  <div className="bg-black/30 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Name</label>
                        <input
                          type="text"
                          defaultValue={session.user?.name || ''}
                          className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Email</label>
                        <input
                          type="email"
                          defaultValue={session.user?.email || ''}
                          className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Email Notifications</span>
                        <button className="w-12 h-6 bg-accent rounded-full relative">
                          <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">SMS Notifications</span>
                        <button className="w-12 h-6 bg-gray-600 rounded-full relative">
                          <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
