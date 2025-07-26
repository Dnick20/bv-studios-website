'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-wedding-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-wedding-accent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-wedding-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-wedding-primary">Client Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-wedding-accent text-wedding-dark rounded-lg hover:bg-wedding-accent/90 transition-colors"
          >
            Sign Out
          </button>
        </div>
        
        <div className="bg-wedding-secondary/50 rounded-2xl p-6 shadow-xl">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-wedding-primary mb-2">Welcome, {user?.email}</h2>
            <p className="text-wedding-text">Access your wedding materials and updates here.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example dashboard cards */}
            <div className="bg-wedding-dark/50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-wedding-primary mb-2">Wedding Timeline</h3>
              <p className="text-wedding-text">View and manage your wedding day schedule.</p>
            </div>
            
            <div className="bg-wedding-dark/50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-wedding-primary mb-2">Shot List</h3>
              <p className="text-wedding-text">Review and update your must-have shots.</p>
            </div>
            
            <div className="bg-wedding-dark/50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-wedding-primary mb-2">Documents</h3>
              <p className="text-wedding-text">Access contracts and important forms.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 