'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function Login() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  return (
    <div className="min-h-screen bg-wedding-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-wedding-secondary/50 p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-wedding-primary">Welcome Back</h2>
          <p className="mt-2 text-sm text-wedding-text">Sign in to access your dashboard</p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#D4B098', // wedding-accent color
                  brandAccent: '#C09578', // darker version of wedding-accent
                  inputBackground: 'rgba(255, 255, 255, 0.05)',
                  inputText: '#ffffff',
                  inputPlaceholder: 'rgba(255, 255, 255, 0.5)',
                }
              }
            },
            className: {
              container: 'supabase-container',
              button: 'supabase-button',
              input: 'supabase-input',
              label: 'supabase-label',
            }
          }}
          theme="dark"
          providers={['google']}
        />
      </div>
    </div>
  )
} 