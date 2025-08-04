'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navigation from '../../components/Navigation'

const MyQuotesPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth')
      return
    }

    const fetchQuotes = async () => {
      try {
        const response = await fetch('/api/wedding/quotes')
        if (response.ok) {
          const data = await response.json()
          setQuotes(data.quotes || [])
        } else if (response.status === 401) {
          // User is not authenticated, redirect to login
          router.push('/auth')
          return
        } else {
          console.error('Failed to fetch quotes')
        }
      } catch (error) {
        console.error('Error fetching quotes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuotes()
  }, [session, status, router])

  const formatPrice = (price) => {
    return `$${(price / 100).toLocaleString()}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your quotes...</p>
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

          {quotes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No quotes yet</h3>
              <p className="text-gray-500 mb-6">You haven't submitted any wedding quotes yet.</p>
              <a
                href="/wedding-booking"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Book Your Wedding
              </a>
            </div>
          ) : (
            <div className="grid gap-6">
              {quotes.map((quote) => (
                <div key={quote.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Quote #{quote.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Submitted on {formatDate(quote.createdAt)}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                      {quote.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Event Date</p>
                      <p className="text-sm text-gray-900">{formatDate(quote.eventDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Event Time</p>
                      <p className="text-sm text-gray-900">{quote.eventTime}</p>
                    </div>
                    {quote.guestCount && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Guest Count</p>
                        <p className="text-sm text-gray-900">{quote.guestCount}</p>
                      </div>
                    )}
                    {quote.venue && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Venue</p>
                        <p className="text-sm text-gray-900">{quote.venue.name}</p>
                      </div>
                    )}
                  </div>
                  
                  {quote.specialRequests && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700">Special Requests</p>
                      <p className="text-sm text-gray-900">{quote.specialRequests}</p>
                    </div>
                  )}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total Price</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {formatPrice(quote.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyQuotesPage 