'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

const WeddingQuoteManager = ({ isAdmin = false }) => {
  const { data: session } = useSession()
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedQuote, setSelectedQuote] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch('/api/wedding/quotes')
        if (response.ok) {
          const data = await response.json()
          setQuotes(data.quotes || [])
        }
      } catch (error) {
        console.error('Error fetching quotes:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchQuotes()
    }
  }, [session])

  const handleStatusUpdate = async (quoteId, newStatus) => {
    try {
      const response = await fetch(`/api/wedding/quotes/${quoteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setQuotes(prev => prev.map(quote => 
          quote.id === quoteId ? { ...quote, status: newStatus } : quote
        ))
      }
    } catch (error) {
      console.error('Error updating quote status:', error)
    }
  }

  const formatPrice = (price) => {
    return `$${(price / 100).toLocaleString()}`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {isAdmin ? 'Wedding Quote Management' : 'My Wedding Quotes'}
        </h2>
        <div className="text-sm text-gray-600">
          {quotes.length} quote{quotes.length !== 1 ? 's' : ''}
        </div>
      </div>

      {quotes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            {isAdmin ? 'No quotes submitted yet.' : 'You haven\'t submitted any quotes yet.'}
          </div>
          {!isAdmin && (
            <a
              href="/wedding-booking"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get a Quote
            </a>
          )}
        </div>
      ) : (
        <div className="grid gap-6">
          {quotes.map((quote) => (
            <div key={quote.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {quote.package?.name || 'Package'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Event: {new Date(quote.eventDate).toLocaleDateString()} at {quote.eventTime}
                  </p>
                  {quote.venue && (
                    <p className="text-sm text-gray-600">
                      Venue: {quote.venue.name}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPrice(quote.totalPrice)}
                  </div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                    {quote.status}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Package Details</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>Duration: {quote.package?.duration} hours</li>
                    <li>Features: {quote.package?.features?.length || 0} included</li>
                    {quote.guestCount && (
                      <li>Guest Count: {quote.guestCount}</li>
                    )}
                  </ul>
                </div>
                
                {quote.addons && quote.addons.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Selected Addons</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {quote.addons.map((addon) => (
                        <li key={addon.id}>
                          {addon.addon?.name} - {formatPrice(addon.price)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {quote.specialRequests && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Special Requests</h4>
                  <p className="text-sm text-gray-600">{quote.specialRequests}</p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Submitted: {new Date(quote.createdAt).toLocaleDateString()}
                </div>
                
                {isAdmin && (
                  <div className="flex space-x-2">
                    <select
                      value={quote.status}
                      onChange={(e) => handleStatusUpdate(quote.id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default WeddingQuoteManager 