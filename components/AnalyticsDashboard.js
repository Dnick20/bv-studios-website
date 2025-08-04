'use client'

import { useState, useEffect } from 'react'
import { analytics } from '../lib/analytics'

const AnalyticsDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalVisitors: 0,
    totalPageviews: 0,
    conversionRate: 0,
    topPages: [],
    recentEvents: [],
    userGrowth: [],
    loading: true
  })

  useEffect(() => {
    // Track admin viewing analytics
    analytics.adminActionPerformed('analytics_dashboard_viewed')
    
    // Simulate loading analytics data (in real implementation, fetch from PostHog API)
    setTimeout(() => {
      setDashboardData({
        totalVisitors: 1247,
        totalPageviews: 3891,
        conversionRate: 12.4,
        topPages: [
          { page: '/wedding-booking', views: 892, conversions: 45 },
          { page: '/weddings', views: 756, conversions: 23 },
          { page: '/', views: 654, conversions: 12 },
          { page: '/contact', views: 445, conversions: 67 },
          { page: '/commercial', views: 234, conversions: 8 }
        ],
        recentEvents: [
          { event: 'Wedding Quote Submitted', count: 23, change: '+15%' },
          { event: 'Contact Form Submitted', count: 67, change: '+8%' },
          { event: 'Package Viewed', count: 432, change: '+22%' },
          { event: 'User Signed In', count: 89, change: '+12%' }
        ],
        userGrowth: [
          { period: 'This Week', users: 234, change: '+18%' },
          { period: 'This Month', users: 892, change: '+24%' },
          { period: 'This Quarter', users: 2156, change: '+31%' }
        ],
        loading: false
      })
    }, 1500)
  }, [])

  const MetricCard = ({ title, value, change, icon, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {change} from last period
            </p>
          )}
        </div>
        <div className="text-4xl opacity-20">{icon}</div>
      </div>
    </div>
  )

  const EventCard = ({ event, count, change }) => (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium text-gray-900">{event}</h3>
          <p className="text-2xl font-bold text-gray-700">{count}</p>
        </div>
        <span className={`text-sm font-medium px-2 py-1 rounded ${
          change.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {change}
        </span>
      </div>
    </div>
  )

  const PageCard = ({ page, views, conversions }) => (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-gray-900 truncate">{page}</h3>
        <span className="text-sm text-gray-500">{views} views</span>
      </div>
      <div className="flex items-center">
        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
          <div 
            className="bg-blue-600 h-2 rounded-full" 
            style={{ width: `${(conversions / views) * 100}%` }}
          ></div>
        </div>
        <span className="text-sm font-medium text-gray-700">{conversions} conv</span>
      </div>
    </div>
  )

  if (dashboardData.loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">📊 BV Studios Analytics</h2>
        <p className="text-blue-100">Real-time insights into your website performance and customer behavior</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Visitors" 
          value={dashboardData.totalVisitors.toLocaleString()} 
          change="+18%" 
          icon="👥" 
          color="#3B82F6"
        />
        <MetricCard 
          title="Page Views" 
          value={dashboardData.totalPageviews.toLocaleString()} 
          change="+24%" 
          icon="📄" 
          color="#10B981"
        />
        <MetricCard 
          title="Conversion Rate" 
          value={`${dashboardData.conversionRate}%`} 
          change="+2.1%" 
          icon="🎯" 
          color="#F59E0B"
        />
        <MetricCard 
          title="Active Users" 
          value="127" 
          change="+31%" 
          icon="⚡" 
          color="#EF4444"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🏆 Top Performing Pages</h3>
          <div className="space-y-3">
            {dashboardData.topPages.map((page, index) => (
              <PageCard key={index} {...page} />
            ))}
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🔥 Recent Activity</h3>
          <div className="space-y-3">
            {dashboardData.recentEvents.map((event, index) => (
              <EventCard key={index} {...event} />
            ))}
          </div>
        </div>
      </div>

      {/* User Growth */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">📈 User Growth Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dashboardData.userGrowth.map((period, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600">{period.period}</p>
              <p className="text-2xl font-bold text-gray-900">{period.users}</p>
              <p className="text-sm text-green-600 font-medium">{period.change}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">⚡ Quick Analytics Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => {
              analytics.adminActionPerformed('view_full_analytics', { source: 'dashboard' })
              window.open('https://us.i.posthog.com', '_blank')
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            🔍 View Full PostHog Dashboard
          </button>
          <button 
            onClick={() => {
              analytics.adminActionPerformed('export_analytics_report')
              alert('📊 Analytics report export initiated!')
            }}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            📊 Export Analytics Report
          </button>
          <button 
            onClick={() => {
              analytics.adminActionPerformed('setup_analytics_alerts')
              alert('🔔 Analytics alerts configuration opened!')
            }}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            🔔 Setup Alerts
          </button>
        </div>
      </div>

      {/* Real-time Activity Feed */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">🔴 Live Activity Feed</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          <div className="flex items-center justify-between py-2 px-3 bg-green-50 rounded border-l-4 border-green-400">
            <span className="text-sm text-gray-700">✅ Wedding quote submitted</span>
            <span className="text-xs text-gray-500">2 min ago</span>
          </div>
          <div className="flex items-center justify-between py-2 px-3 bg-blue-50 rounded border-l-4 border-blue-400">
            <span className="text-sm text-gray-700">👀 Package viewed: Gold Collection</span>
            <span className="text-xs text-gray-500">5 min ago</span>
          </div>
          <div className="flex items-center justify-between py-2 px-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
            <span className="text-sm text-gray-700">📧 Contact form started</span>
            <span className="text-xs text-gray-500">8 min ago</span>
          </div>
          <div className="flex items-center justify-between py-2 px-3 bg-purple-50 rounded border-l-4 border-purple-400">
            <span className="text-sm text-gray-700">🔐 User signed in</span>
            <span className="text-xs text-gray-500">12 min ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard