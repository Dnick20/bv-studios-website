'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navigation from '../../components/Navigation'
import WeddingQuoteManager from '../../components/WeddingQuoteManager'
import { weddingAnalytics, analyticsHelpers } from '../../lib/analytics'

const MyQuotesPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Track page visit
  if (status === 'authenticated' && session) {
    weddingAnalytics.pageView('My Quotes', {
      has_session: !!session,
      user_email: session?.user?.email,
    })

    // Identify user for quotes review
    if (session?.user?.email) {
      analyticsHelpers.identifyUser(session.user.email, {
        reviewing_quotes: true,
        quote_review_timestamp: new Date().toISOString(),
      })
    }
  }

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!session) {
    weddingAnalytics.conversionAbandoned(
      'quote_review',
      'user_not_authenticated'
    )
    router.push('/auth')
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              My Wedding Quotes
            </h1>
            <p className="text-xl text-gray-600">
              View and manage your wedding videography quotes
            </p>
          </div>

          <WeddingQuoteManager isAdmin={false} />
        </div>
      </div>
    </div>
  )
}

export default MyQuotesPage
