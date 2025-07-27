'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navigation from '../../../components/Navigation'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (error) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration. Please try again later.'
      case 'AccessDenied':
        return 'You do not have permission to sign in.'
      case 'Verification':
        return 'The verification link has expired or has already been used.'
      case 'Default':
        return 'An error occurred during authentication.'
      default:
        return 'An unexpected error occurred. Please try again.'
    }
  }

  return (
    <div className="min-h-screen bg-primary">
      <Navigation />
      
      <div className="flex items-center justify-center min-h-screen pt-20">
        <div className="w-full max-w-md">
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-8 border border-gray-800">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Authentication Error</h1>
              <p className="text-gray-300">Something went wrong with the sign-in process</p>
            </div>

            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{getErrorMessage(error)}</p>
            </div>

            <div className="space-y-4">
              <Link
                href="/auth/signin"
                className="w-full block text-center py-3 bg-accent text-primary font-semibold rounded-lg hover:bg-accent/90 transition-colors"
              >
                Try Again
              </Link>
              
              <Link
                href="/"
                className="w-full block text-center py-3 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Go Home
              </Link>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-300 text-sm">
                If this problem persists, please contact support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthError() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
} 