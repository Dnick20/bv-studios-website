'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  weddingAnalytics as analytics,
  analyticsHelpers,
} from '../../lib/analytics'
import { safeJson } from '../../lib/utils/safeJson'

const WeddingBookingPage = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [data, setData] = useState(null)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [selectedAddons, setSelectedAddons] = useState([])
  const [selectedVenue, setSelectedVenue] = useState('')
  const [otherVenue, setOtherVenue] = useState('')
  const [quoteData, setQuoteData] = useState({
    eventDate: '',
    eventTime: '',
    guestCount: '',
    specialRequests: '',
  })

  // Derive time windows based on package duration (hours)
  const getTimeWindows = (hours) => {
    const h = Number(hours || 4)
    if (h <= 4) {
      return [
        { label: 'Morning (8 AM - 12 PM)', value: '08:00-12:00' },
        { label: 'Afternoon (12 PM - 4 PM)', value: '12:00-16:00' },
        { label: 'Evening (4 PM - 8 PM)', value: '16:00-20:00' },
      ]
    }
    if (h <= 8) {
      return [
        { label: 'Morning (9 AM - 5 PM)', value: '09:00-17:00' },
        { label: 'Afternoon (12 PM - 8 PM)', value: '12:00-20:00' },
        { label: 'Evening (2 PM - 10 PM)', value: '14:00-22:00' },
      ]
    }
    return [
      { label: 'All Day (10 AM - 10 PM)', value: '10:00-22:00' },
      { label: 'Early Day (8 AM - 8 PM)', value: '08:00-20:00' },
    ]
  }

  useEffect(() => {
    // Track page view
    analytics.pageView('Wedding Booking', {
      has_session: !!session,
      user_email: session?.user?.email,
    })

    // Start session timer for analytics
    analyticsHelpers.startTimer('wedding_booking_session')

    // Identify user if logged in
    if (session?.user?.email) {
      analyticsHelpers.identifyUser(session.user.email, {
        name: session.user.name,
        booking_session_start: new Date().toISOString(),
      })
    }

    const fetchData = async () => {
      try {
        const [packagesRes, addonsRes, venuesRes] = await Promise.all([
          fetch('/api/wedding/packages'),
          fetch('/api/wedding/addons'),
          fetch('/api/wedding/venues'),
        ])

        const packagesData = await safeJson(packagesRes, { packages: [] })
        const addonsData = await safeJson(addonsRes, { addons: [] })
        const venuesData = await safeJson(venuesRes, { venues: [] })

        setData({
          packages: packagesData.packages || [],
          addons: addonsData.addons || [],
          venues: venuesData.venues || [],
        })

        // Track data loading performance
        analytics.performanceMetric('data_load_success', true)
      } catch (error) {
        console.error('Error fetching data:', error)
        analytics.performanceMetric('data_load_error', error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session])

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg)
    // Reset event time so user must choose a compatible window for this package
    setQuoteData((prev) => ({ ...prev, eventTime: '' }))

    // Track package selection
    analytics.packageSelected(pkg)

    // If this is their first package selection, track quote started
    if (!selectedPackage) {
      analytics.quoteStarted(pkg)
    }
  }

  const handleAddonToggle = (addon) => {
    setSelectedAddons((prev) => {
      const exists = prev.find((a) => a.addonId === addon.id)
      if (exists) {
        // Track addon removal
        analytics.addonRemoved(addon, selectedPackage)
        return prev.filter((a) => a.addonId !== addon.id)
      } else {
        // Track addon addition
        analytics.addonAdded(addon, selectedPackage)
        return [...prev, { addonId: addon.id, price: addon.price }]
      }
    })
  }

  const calculateTotalPrice = () => {
    let total = selectedPackage ? selectedPackage.price : 0
    selectedAddons.forEach((addon) => {
      total += addon.price
    })
    return total
  }

  const handleSubmitQuote = async (e) => {
    e.preventDefault()

    if (!session) {
      // Track conversion abandonment
      analytics.conversionAbandoned(
        'authentication_required',
        'user_not_logged_in'
      )
      router.push('/auth')
      return
    }

    if (!selectedPackage) {
      analytics.conversionAbandoned('package_selection', 'no_package_selected')
      alert('Please select a package')
      return
    }

    if (!quoteData.eventDate || !quoteData.eventTime) {
      analytics.conversionAbandoned('form_completion', 'missing_date_time')
      alert('Please select event date and time')
      return
    }

    setSubmitting(true)

    try {
      // Determine venue information
      let venueId = null
      let venueName = null

      if (selectedVenue === 'other') {
        venueName = otherVenue
        analytics.customVenueSelected(otherVenue)
      } else if (selectedVenue) {
        const venue = data.venues.find((v) => v.id === selectedVenue)
        venueName = venue?.name
        venueId = selectedVenue
        analytics.venueSelected(venue)
      }

      const totalPrice = calculateTotalPrice()
      const sessionDuration = analyticsHelpers.endTimer(
        'wedding_booking_session'
      )

      const response = await fetch('/api/wedding/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          eventDate: quoteData.eventDate,
          eventTime: quoteData.eventTime,
          // Always include venueName; include venueId only if not 'other'
          venueId: selectedVenue && selectedVenue !== 'other' ? selectedVenue : null,
          venueName: venueName,
          guestCount: quoteData.guestCount || null,
          specialRequests: quoteData.specialRequests || null,
          addons: selectedAddons,
        }),
      })

      if (response.ok) {
        const result = await safeJson(response)

        // Track successful quote submission
        analytics.quoteSubmitted({
          id: result.quote?.id,
          packageId: selectedPackage.id,
          totalPrice,
          guestCount: quoteData.guestCount,
          eventDate: quoteData.eventDate,
          eventTime: quoteData.eventTime,
          venueId,
          addons: selectedAddons,
        })

        // Track user engagement
        analytics.userEngagement('quote_completed', sessionDuration)

        try {
          if (typeof window !== 'undefined' && result) {
            const last = {
              id: result.quote?.id || Date.now(),
              createdAt: new Date().toISOString(),
              eventDate: quoteData.eventDate,
              eventTime: quoteData.eventTime,
              venueName,
              guestCount: quoteData.guestCount || null,
              totalPrice,
              status: 'pending',
              package: {
                id: selectedPackage.id,
                name: selectedPackage.name,
                price: selectedPackage.price,
                duration: selectedPackage.duration,
              },
              quoteAddons: selectedAddons.map((a) => ({
                id: a.addonId,
                addon: data.addons.find((x) => x.id === a.addonId) || null,
              })),
              specialRequests: quoteData.specialRequests || '',
              venue: venueName ? { name: venueName } : null,
              user: session?.user || null,
            }
            localStorage.setItem('lastSubmittedQuote', JSON.stringify(last))
          }
        } catch {}

        alert('Quote submitted successfully!')
        router.push('/my-quotes')
      } else {
        const error = await safeJson(response)
        analytics.conversionAbandoned('submission_error', error.message)
        alert(`Error: ${error.message}`)
      }
    } catch (error) {
      console.error('Error submitting quote:', error)
      analytics.conversionAbandoned('technical_error', error.message)
      alert('Error submitting quote. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading wedding packages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Back to Weddings */}
        <div className="mb-6 flex items-center justify-between">
          <a
            href="/weddings"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 underline"
            aria-label="Back to Weddings page"
          >
            ← Back to Weddings
          </a>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Wedding Booking
          </h1>
          <p className="text-xl text-gray-600">
            Choose your perfect wedding package
          </p>
        </div>

        {/* Package Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Select Your Package
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data?.packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-white rounded-lg shadow-lg p-6 cursor-pointer transition-all ${
                  selectedPackage?.id === pkg.id
                    ? 'ring-2 ring-blue-500 shadow-xl'
                    : 'hover:shadow-xl'
                }`}
                onClick={() => handlePackageSelect(pkg)}
                onMouseEnter={() => analytics.packageViewed(pkg)}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {pkg.name}
                </h3>
                <p className="text-gray-600 mb-4">{pkg.description}</p>
                <div className="mb-4">
                  <p className="text-3xl font-bold text-blue-600">
                    ${(pkg.price / 100).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {pkg.duration} hours of coverage
                  </p>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Includes:
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {pkg.features &&
                      (() => {
                        try {
                          const features = JSON.parse(pkg.features)
                          return features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <span className="text-green-500 mr-2">✓</span>
                              {feature}
                            </li>
                          ))
                        } catch (error) {
                          // If JSON parsing fails, try to parse as a simple string array
                          try {
                            const features = pkg.features
                              .replace(/^\[|\]$/g, '')
                              .split(',')
                              .map((f) => f.trim().replace(/"/g, ''))
                            return features.map((feature, index) => (
                              <li key={index} className="flex items-center">
                                <span className="text-green-500 mr-2">✓</span>
                                {feature}
                              </li>
                            ))
                          } catch (e) {
                            // If all parsing fails, show a default message
                            return (
                              <li className="flex items-center">
                                <span className="text-green-500 mr-2">✓</span>
                                Professional wedding videography coverage
                              </li>
                            )
                          }
                        }
                      })()}
                  </ul>
                </div>
                <button
                  className={`w-full py-2 px-4 rounded-lg transition-colors ${
                    selectedPackage?.id === pkg.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePackageSelect(pkg)
                  }}
                >
                  {selectedPackage?.id === pkg.id
                    ? 'Selected'
                    : 'Select Package'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add-ons Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Customize Your Package
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data?.addons.map((addon) => {
              const isSelected = selectedAddons.find(
                (a) => a.addonId === addon.id
              )
              return (
                <div
                  key={addon.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleAddonToggle(addon)}
                  onMouseEnter={() => analytics.addonViewed(addon)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={!!isSelected}
                          onChange={() => handleAddonToggle(addon)}
                          className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <h3 className="font-semibold text-gray-900">
                          {addon.name}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        {addon.description}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-blue-600 ml-4">
                      ${(addon.price / 100).toLocaleString()}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Venue Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Choose Your Venue (Optional)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data?.venues.map((venue) => (
              <div
                key={venue.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedVenue === venue.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedVenue(venue.id)}
                onMouseEnter={() => analytics.venueViewed(venue)}
              >
                <div className="flex items-start mb-2">
                  <input
                    type="radio"
                    name="venue"
                    checked={selectedVenue === venue.id}
                    onChange={() => setSelectedVenue(venue.id)}
                    className="mr-3 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {venue.name}
                    </h3>
                    <p className="text-sm text-gray-600">{venue.description}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {venue.address}, {venue.city}, {venue.state}
                    </p>
                    {venue.phone && (
                      <p className="text-sm text-gray-500">{venue.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Other Venue Option */}
            <div
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedVenue === 'other'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedVenue('other')}
            >
              <div className="flex items-start mb-2">
                <input
                  type="radio"
                  name="venue"
                  checked={selectedVenue === 'other'}
                  onChange={() => setSelectedVenue('other')}
                  className="mr-3 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Other Venue</h3>
                  <p className="text-sm text-gray-600">
                    Enter your venue details
                  </p>
                  {selectedVenue === 'other' && (
                    <input
                      type="text"
                      value={otherVenue}
                      onChange={(e) => setOtherVenue(e.target.value)}
                      placeholder="Enter venue name"
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quote Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Event Details
          </h2>
          <form onSubmit={handleSubmitQuote} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Date *
                </label>
                <input
                  type="date"
                  required
                  value={quoteData.eventDate}
                  onChange={(e) => {
                    setQuoteData({ ...quoteData, eventDate: e.target.value })
                    analytics.quoteFormFilled('event_date', e.target.value)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Time *
                </label>
                <select
                  required
                  value={quoteData.eventTime}
                  onChange={(e) => {
                    setQuoteData({ ...quoteData, eventTime: e.target.value })
                    analytics.quoteFormFilled('event_time', e.target.value)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                >
                  <option value="">Select time</option>
                  {getTimeWindows(selectedPackage?.duration).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guest Count
                </label>
                <input
                  type="number"
                  value={quoteData.guestCount}
                  onChange={(e) =>
                    setQuoteData({ ...quoteData, guestCount: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="Approximate number of guests"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests
              </label>
              <textarea
                value={quoteData.specialRequests}
                onChange={(e) =>
                  setQuoteData({
                    ...quoteData,
                    specialRequests: e.target.value,
                  })
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                placeholder="Any special requests or details about your wedding..."
              />
            </div>

            {/* Price Summary */}
            {selectedPackage && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Price Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-900">
                    <span className="font-medium">{selectedPackage.name}</span>
                    <span className="font-medium">
                      ${(selectedPackage.price / 100).toLocaleString()}
                    </span>
                  </div>
                  {selectedAddons.map((addon) => {
                    const addonData = data.addons.find(
                      (a) => a.id === addon.addonId
                    )
                    return (
                      <div
                        key={addon.addonId}
                        className="flex justify-between text-sm text-gray-700"
                      >
                        <span>+ {addonData?.name}</span>
                        <span>${(addon.price / 100).toLocaleString()}</span>
                      </div>
                    )
                  })}
                  <div className="border-t pt-2 mt-4">
                    <div className="flex justify-between font-semibold text-lg text-gray-900">
                      <span>Total</span>
                      <span>
                        ${(calculateTotalPrice() / 100).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !selectedPackage}
                className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                  submitting || !selectedPackage
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {submitting ? 'Submitting...' : 'Submit Quote Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default WeddingBookingPage
