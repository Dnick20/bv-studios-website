'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { safeJson } from '../lib/utils/safeJson'

const WeddingQuoteManager = ({ isAdmin = false }) => {
  const { data: session } = useSession()
  const [quotes, setQuotes] = useState([])
  const [filteredQuotes, setFilteredQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedQuote, setSelectedQuote] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [quoteToDelete, setQuoteToDelete] = useState(null)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // Enhanced filtering and search
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  // Bulk actions
  const [selectedQuotes, setSelectedQuotes] = useState(new Set())
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [bulkStatus, setBulkStatus] = useState('pending')
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false)

  // Quick view modal
  const [showQuickView, setShowQuickView] = useState(false)
  const [quickViewQuote, setQuickViewQuote] = useState(null)

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        setError(null)
        const endpoint = isAdmin
          ? '/api/admin/wedding-quotes'
          : '/api/wedding/quotes'
        const response = await fetch(endpoint)
        if (response.ok) {
          const data = await safeJson(response, { quotes: [] })
          setQuotes(data.quotes || [])
          setFilteredQuotes(data.quotes || [])
        } else {
          const errorData = await safeJson(response, {})
          setError(errorData.message || 'Failed to fetch quotes')
        }
      } catch (error) {
        console.error('Error fetching quotes:', error)
        setError('Failed to fetch quotes. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchQuotes()
    }
  }, [session, isAdmin])

  // Filter and sort quotes
  useEffect(() => {
    let filtered = [...quotes]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (quote) =>
          quote.package?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          quote.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quote.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quote.venue?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((quote) => quote.status === statusFilter)
    }

    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter((quote) => {
            const quoteDate = new Date(quote.createdAt)
            return quoteDate.toDateString() === now.toDateString()
          })
          break
        case 'week':
          filtered = filtered.filter((quote) => {
            const quoteDate = new Date(quote.createdAt)
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            return quoteDate >= weekAgo
          })
          break
        case 'month':
          filtered = filtered.filter((quote) => {
            const quoteDate = new Date(quote.createdAt)
            return quoteDate >= thirtyDaysAgo
          })
          break
        case 'quarter':
          filtered = filtered.filter((quote) => {
            const quoteDate = new Date(quote.createdAt)
            return quoteDate >= ninetyDaysAgo
          })
          break
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case 'createdAt':
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
        case 'eventDate':
          aValue = new Date(a.eventDate)
          bValue = new Date(b.eventDate)
          break
        case 'totalPrice':
          aValue = a.totalPrice
          bValue = b.totalPrice
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        default:
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredQuotes(filtered)
  }, [quotes, searchTerm, statusFilter, dateFilter, sortBy, sortOrder])

  const handleStatusUpdate = async (quoteId, newStatus) => {
    try {
      setError(null)
      const response = await fetch(`/api/wedding/quotes/${quoteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setQuotes((prev) =>
          prev.map((quote) =>
            quote.id === quoteId ? { ...quote, status: newStatus } : quote
          )
        )
        setSuccessMessage('Quote status updated successfully')
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        const errorData = await safeJson(response, {})
        setError(errorData.message || 'Failed to update quote status')
      }
    } catch (error) {
      console.error('Error updating quote status:', error)
      setError('Failed to update quote status. Please try again.')
    }
  }

  const handleDeleteQuote = async (quoteId) => {
    try {
      setError(null)
      const response = await fetch(`/api/wedding/quotes/${quoteId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setQuotes((prev) => prev.filter((quote) => quote.id !== quoteId))
        setSuccessMessage('Quote deleted successfully')
        setTimeout(() => setSuccessMessage(null), 3000)
        setShowDeleteConfirm(false)
        setQuoteToDelete(null)
      } else {
        const errorData = await safeJson(response, {})
        setError(errorData.message || 'Failed to delete quote')
      }
    } catch (error) {
      console.error('Error deleting quote:', error)
      setError('Failed to delete quote. Please try again.')
    }
  }

  const confirmDelete = (quote) => {
    setQuoteToDelete(quote)
    setShowDeleteConfirm(true)
  }

  const formatPrice = (price) => {
    return `$${(price / 100).toLocaleString()}`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳'
      case 'approved':
        return '✅'
      case 'rejected':
        return '❌'
      case 'completed':
        return '🎉'
      default:
        return '📋'
    }
  }

  const getPaymentStatusIcon = (paymentStatus) => {
    switch (paymentStatus) {
      case 'pending':
        return '💳'
      case 'deposit_paid':
        return '💰'
      case 'paid':
        return '✅'
      case 'failed':
        return '❌'
      case 'canceled':
        return '🚫'
      default:
        return '📋'
    }
  }

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case 'pending':
        return 'bg-gray-100 text-gray-800'
      case 'deposit_paid':
        return 'bg-blue-100 text-blue-800'
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'canceled':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const sendEmailNotification = async (quoteId, emailType) => {
    try {
      const response = await fetch('/api/wedding/notifications/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteId,
          emailType,
          recipientEmail: null, // Will use quote user's email
        }),
      })

      if (response.ok) {
        setSuccessMessage('Email notification sent successfully')
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        console.error('Failed to send email notification')
      }
    } catch (error) {
      console.error('Error sending email notification:', error)
    }
  }

  const exportQuotes = () => {
    const csvContent = [
      [
        'ID',
        'Client',
        'Client Email',
        'Package',
        'Event Date',
        'Event Time',
        'Venue',
        'Guest Count',
        'Total Price',
        'Status',
        'Payment Status',
        'Special Requests',
        'Created Date',
      ],
      ...filteredQuotes.map((quote) => [
        quote.id,
        quote.user?.name || 'N/A',
        quote.user?.email || 'N/A',
        quote.package?.name || 'N/A',
        new Date(quote.eventDate).toLocaleDateString(),
        quote.eventTime,
        quote.venue?.name || quote.venueName || 'N/A',
        quote.guestCount || 'N/A',
        formatPrice(quote.totalPrice),
        quote.status,
        quote.paymentStatus || 'N/A',
        quote.specialRequests || 'N/A',
        new Date(quote.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.map((field) => `"${field}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `wedding-quotes-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getQuoteStats = () => {
    const stats = {
      total: filteredQuotes.length,
      pending: filteredQuotes.filter((q) => q.status === 'pending').length,
      approved: filteredQuotes.filter((q) => q.status === 'approved').length,
      rejected: filteredQuotes.filter((q) => q.status === 'rejected').length,
      completed: filteredQuotes.filter((q) => q.status === 'completed').length,
      totalValue: filteredQuotes.reduce((sum, q) => sum + q.totalPrice, 0),
    }
    return stats
  }

  // Bulk action functions
  const handleSelectAll = () => {
    if (selectedQuotes.size === filteredQuotes.length) {
      setSelectedQuotes(new Set())
    } else {
      setSelectedQuotes(new Set(filteredQuotes.map((q) => q.id)))
    }
  }

  const handleSelectQuote = (quoteId) => {
    const newSelected = new Set(selectedQuotes)
    if (newSelected.has(quoteId)) {
      newSelected.delete(quoteId)
    } else {
      newSelected.add(quoteId)
    }
    setSelectedQuotes(newSelected)
  }

  const handleBulkStatusUpdate = async () => {
    try {
      setError(null)
      const promises = Array.from(selectedQuotes).map((quoteId) =>
        fetch(`/api/wedding/quotes/${quoteId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: bulkStatus }),
        })
      )

      const responses = await Promise.all(promises)
      const allSuccessful = responses.every((r) => r.ok)

      if (allSuccessful) {
        setQuotes((prev) =>
          prev.map((quote) =>
            selectedQuotes.has(quote.id)
              ? { ...quote, status: bulkStatus }
              : quote
          )
        )
        setSuccessMessage(
          `Successfully updated ${selectedQuotes.size} quote(s) to ${bulkStatus}`
        )
        setSelectedQuotes(new Set())
        setShowBulkActions(false)
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        setError('Some quotes failed to update. Please try again.')
      }
    } catch (error) {
      console.error('Bulk status update error:', error)
      setError('Failed to update quotes. Please try again.')
    }
  }

  const handleBulkDelete = async () => {
    try {
      setError(null)
      const promises = Array.from(selectedQuotes).map((quoteId) =>
        fetch(`/api/wedding/quotes/${quoteId}`, { method: 'DELETE' })
      )

      const responses = await Promise.all(promises)
      const allSuccessful = responses.every((r) => r.ok)

      if (allSuccessful) {
        setQuotes((prev) =>
          prev.filter((quote) => !selectedQuotes.has(quote.id))
        )
        setSuccessMessage(
          `Successfully deleted ${selectedQuotes.size} quote(s)`
        )
        setSelectedQuotes(new Set())
        setShowBulkDeleteConfirm(false)
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        setError('Some quotes failed to delete. Please try again.')
      }
    } catch (error) {
      console.error('Bulk delete error:', error)
      setError('Failed to delete quotes. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const stats = getQuoteStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {isAdmin ? 'Wedding Quote Management' : 'My Wedding Quotes'}
        </h2>
        <div className="text-sm text-gray-600">
          {filteredQuotes.length} of {quotes.length} quote
          {quotes.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Stats Cards for Admin */}
      {isAdmin && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-blue-600">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-green-600">
              {stats.approved}
            </div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-red-600">
              {stats.rejected}
            </div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-blue-600">
              {stats.completed}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-green-600">
              {formatPrice(stats.totalValue)}
            </div>
            <div className="text-sm text-gray-600">Total Value</div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search quotes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="createdAt">Created Date</option>
              <option value="eventDate">Event Date</option>
              <option value="totalPrice">Price</option>
              <option value="status">Status</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Export Button */}
        {isAdmin && filteredQuotes.length > 0 && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={exportQuotes}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
            >
              📊 Export to CSV
            </button>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {isAdmin && filteredQuotes.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedQuotes.size === filteredQuotes.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Select All ({selectedQuotes.size} of {filteredQuotes.length})
                </span>
              </label>
            </div>

            {selectedQuotes.size > 0 && (
              <div className="flex items-center space-x-3">
                <select
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                </select>
                <button
                  onClick={() => setShowBulkActions(true)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  Update Status ({selectedQuotes.size})
                </button>
                <button
                  onClick={() => setShowBulkDeleteConfirm(true)}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete ({selectedQuotes.size})
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError(null)}
                className="inline-flex text-red-400 hover:text-red-500"
              >
                <span className="sr-only">Dismiss</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredQuotes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            {quotes.length === 0
              ? isAdmin
                ? 'No quotes submitted yet.'
                : "You haven't submitted any quotes yet."
              : 'No quotes match your current filters.'}
          </div>
          {!isAdmin && quotes.length === 0 && (
            <a
              href="/wedding-booking"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get a Quote
            </a>
          )}
          {quotes.length > 0 && (
            <button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setDateFilter('all')
              }}
              className="mt-4 inline-block bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        /* Quotes List */
        <div className="grid gap-6">
          {filteredQuotes.map((quote) => (
            <div
              key={quote.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              {/* Bulk Selection Checkbox */}
              {isAdmin && (
                <div className="flex justify-end mb-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedQuotes.has(quote.id)}
                      onChange={() => handleSelectQuote(quote.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-xs text-gray-600">Select</span>
                  </label>
                </div>
              )}

              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">
                      {getStatusIcon(quote.status)}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {quote.package?.name || 'Package'}
                    </h3>
                  </div>
                  {isAdmin && quote.user && (
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Client:</strong>{' '}
                      {quote.user.name || quote.user.email}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    Event: {new Date(quote.eventDate).toLocaleDateString()} at{' '}
                    {quote.eventTime}
                  </p>
                  {quote.venue && (
                    <p className="text-sm text-gray-600">
                      Venue: {quote.venue.name}
                    </p>
                  )}
                </div>
                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPrice(quote.totalPrice)}
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      quote.status
                    )}`}
                  >
                    {quote.status.charAt(0).toUpperCase() +
                      quote.status.slice(1)}
                  </span>

                  {/* Payment Status */}
                  {quote.paymentStatus && (
                    <div className="mt-2">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                          quote.paymentStatus
                        )}`}
                      >
                        <span className="mr-1">
                          {getPaymentStatusIcon(quote.paymentStatus)}
                        </span>
                        {quote.paymentStatus
                          .replace('_', ' ')
                          .charAt(0)
                          .toUpperCase() +
                          quote.paymentStatus.replace('_', ' ').slice(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Package Details
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>Duration: {quote.package?.duration} hours</li>
                    <li>
                      Features: {quote.package?.features?.length || 0} included
                    </li>
                    {quote.guestCount && (
                      <li>Guest Count: {quote.guestCount}</li>
                    )}
                  </ul>
                </div>

                {quote.quoteAddons && quote.quoteAddons.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Selected Addons
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {quote.quoteAddons.map((quoteAddon) => (
                        <li key={quoteAddon.id}>
                          {quoteAddon.addon?.name} -{' '}
                          {formatPrice(quoteAddon.addon?.price || 0)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {quote.specialRequests && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Special Requests
                  </h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                    {quote.specialRequests}
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Submitted: {new Date(quote.createdAt).toLocaleDateString()}
                </div>

                <div className="flex space-x-2">
                  {isAdmin && (
                    <select
                      value={quote.status}
                      onChange={(e) =>
                        handleStatusUpdate(quote.id, e.target.value)
                      }
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="completed">Completed</option>
                    </select>
                  )}

                  {/* Email Notification Buttons for Admins */}
                  {isAdmin && (
                    <div className="flex space-x-1">
                      <button
                        onClick={() =>
                          sendEmailNotification(quote.id, 'quoteSubmitted')
                        }
                        className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                        title="Send Quote Submitted Email"
                      >
                        📧 Quote
                      </button>
                      <button
                        onClick={() =>
                          sendEmailNotification(quote.id, 'quoteApproved')
                        }
                        className="px-2 py-1 text-xs text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                        title="Send Quote Approved Email"
                      >
                        📧 Approved
                      </button>
                      <button
                        onClick={() =>
                          sendEmailNotification(quote.id, 'paymentReceived')
                        }
                        className="px-2 py-1 text-xs text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded transition-colors"
                        title="Send Payment Received Email"
                      >
                        📧 Payment
                      </button>
                    </div>
                  )}

                  {/* Quick View Button */}
                  <button
                    onClick={() => {
                      setQuickViewQuote(quote)
                      setShowQuickView(true)
                    }}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                    title="Quick View"
                  >
                    👁️ View
                  </button>

                  <button
                    onClick={() => confirmDelete(quote)}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && quoteToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this quote for{' '}
              <span className="font-medium">
                {quoteToDelete.package?.name || 'Package'}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setQuoteToDelete(null)
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteQuote(quoteToDelete.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Status Update Confirmation Modal */}
      {showBulkActions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Bulk Status Update
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to update{' '}
              <strong>{selectedQuotes.size}</strong> quote(s) to status{' '}
              <span className="font-medium capitalize">{bulkStatus}</span>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowBulkActions(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkStatusUpdate}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Update {selectedQuotes.size} Quote(s)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Bulk Delete
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete{' '}
              <strong>{selectedQuotes.size}</strong> quote(s)? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowBulkDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Delete {selectedQuotes.size} Quote(s)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {showQuickView && quickViewQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Quote Details - {quickViewQuote.package?.name}
              </h3>
              <button
                onClick={() => {
                  setShowQuickView(false)
                  setQuickViewQuote(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client Information */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Client Information
                </h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Name:</strong> {quickViewQuote.user?.name || 'N/A'}
                  </p>
                  <p>
                    <strong>Email:</strong>{' '}
                    {quickViewQuote.user?.email || 'N/A'}
                  </p>
                  <p>
                    <strong>Quote ID:</strong> {quickViewQuote.id}
                  </p>
                  <p>
                    <strong>Status:</strong>
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        quickViewQuote.status
                      )}`}
                    >
                      {quickViewQuote.status.charAt(0).toUpperCase() +
                        quickViewQuote.status.slice(1)}
                    </span>
                  </p>
                  {quickViewQuote.paymentStatus && (
                    <p>
                      <strong>Payment:</strong>
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                          quickViewQuote.paymentStatus
                        )}`}
                      >
                        {quickViewQuote.paymentStatus
                          .replace('_', ' ')
                          .charAt(0)
                          .toUpperCase() +
                          quickViewQuote.paymentStatus
                            .replace('_', ' ')
                            .slice(1)}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Event Information */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Event Information
                </h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Date:</strong>{' '}
                    {new Date(quickViewQuote.eventDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Time:</strong> {quickViewQuote.eventTime}
                  </p>
                  <p>
                    <strong>Venue:</strong>{' '}
                    {quickViewQuote.venue?.name ||
                      quickViewQuote.venueName ||
                      'N/A'}
                  </p>
                  <p>
                    <strong>Guest Count:</strong>{' '}
                    {quickViewQuote.guestCount || 'N/A'}
                  </p>
                  <p>
                    <strong>Total Price:</strong>{' '}
                    <span className="font-bold text-blue-600">
                      {formatPrice(quickViewQuote.totalPrice)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Package Details */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Package Details
                </h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Package:</strong> {quickViewQuote.package?.name}
                  </p>
                  <p>
                    <strong>Duration:</strong>{' '}
                    {quickViewQuote.package?.duration} hours
                  </p>
                  <p>
                    <strong>Base Price:</strong>{' '}
                    {formatPrice(quickViewQuote.package?.price || 0)}
                  </p>
                  <p>
                    <strong>Features:</strong>{' '}
                    {quickViewQuote.package?.features?.length || 0} included
                  </p>
                </div>
              </div>

              {/* Addons */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Selected Addons
                </h4>
                {quickViewQuote.quoteAddons &&
                quickViewQuote.quoteAddons.length > 0 ? (
                  <div className="space-y-2 text-sm">
                    {quickViewQuote.quoteAddons.map((quoteAddon) => (
                      <div key={quoteAddon.id} className="flex justify-between">
                        <span>{quoteAddon.addon?.name}</span>
                        <span className="font-medium">
                          {formatPrice(quoteAddon.addon?.price || 0)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No addons selected</p>
                )}
              </div>
            </div>

            {/* Special Requests */}
            {quickViewQuote.specialRequests && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">
                  Special Requests
                </h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                  {quickViewQuote.specialRequests}
                </p>
              </div>
            )}

            {/* Timestamps */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                <p>
                  <strong>Created:</strong>{' '}
                  {new Date(quickViewQuote.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Updated:</strong>{' '}
                  {new Date(quickViewQuote.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WeddingQuoteManager
