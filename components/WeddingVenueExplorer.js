'use client'

import { useState, useEffect } from 'react'

const WeddingVenueExplorer = () => {
  const [venues, setVenues] = useState([])
  const [filteredVenues, setFilteredVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedType, setSelectedType] = useState('')

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch('/api/wedding/venues')
        if (response.ok) {
          const data = await response.json().catch(() => ({ venues: [] }))
          setVenues(data.venues || [])
          setFilteredVenues(data.venues || [])
        }
      } catch (error) {
        console.error('Error fetching venues:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVenues()
  }, [])

  useEffect(() => {
    let filtered = venues

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (venue) =>
          venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          venue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          venue.address.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by city
    if (selectedCity) {
      filtered = filtered.filter((venue) => venue.city === selectedCity)
    }

    // Filter by type
    if (selectedType) {
      filtered = filtered.filter((venue) => {
        const description = venue.description.toLowerCase()
        switch (selectedType) {
          case 'outdoor':
            return (
              description.includes('outdoor') || description.includes('garden')
            )
          case 'indoor':
            return (
              description.includes('ballroom') || description.includes('loft')
            )
          case 'church':
            return (
              description.includes('church') ||
              description.includes('traditional')
            )
          default:
            return true
        }
      })
    }

    setFilteredVenues(filtered)
  }, [venues, searchTerm, selectedCity, selectedType])

  const getCities = () => {
    const cities = [...new Set(venues.map((venue) => venue.city))]
    return cities.sort()
  }

  const getVenueType = (venue) => {
    const description = venue.description.toLowerCase()
    if (description.includes('outdoor') || description.includes('garden')) {
      return 'outdoor'
    } else if (
      description.includes('ballroom') ||
      description.includes('loft')
    ) {
      return 'indoor'
    } else if (
      description.includes('church') ||
      description.includes('traditional')
    ) {
      return 'church'
    }
    return 'other'
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'outdoor':
        return 'bg-green-100 text-green-800'
      case 'indoor':
        return 'bg-blue-100 text-blue-800'
      case 'church':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCity('')
    setSelectedType('')
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
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Explore Wedding Venues
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover beautiful venues in Lexington, KY for your special day
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Filter Venues
        </h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Venues
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, description, or address..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Cities</option>
              {getCities().map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Venue Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="outdoor">Outdoor</option>
              <option value="indoor">Indoor</option>
              <option value="church">Church</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Venues ({filteredVenues.length})
        </h3>
        {filteredVenues.length !== venues.length && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Show all venues
          </button>
        )}
      </div>

      {filteredVenues.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            No venues match your current filters.
          </div>
          <button
            onClick={clearFilters}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Clear filters to see all venues
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue) => (
            <div
              key={venue.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {venue.name}
                  </h4>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                      getVenueType(venue)
                    )}`}
                  >
                    {getVenueType(venue)}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {venue.address}, {venue.city}, {venue.state}
                  </div>

                  <p className="text-sm text-gray-600">{venue.description}</p>

                  <div className="space-y-1 text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      {venue.phone}
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5a2 2 0 112.828 2.828l-1.5 1.5a1 1 0 001.414 1.414l1.5-1.5a4 4 0 00-5.656 0l-3 3a4 4 0 00.707 5.707l3-3a1 1 0 011.414 1.414l-3 3a2 2 0 11-2.828-2.828l3-3a1 1 0 001.414-1.414l-3 3a2 2 0 01-2.828 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <a
                        href={venue.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <a
                    href="/wedding-booking"
                    className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Select This Venue
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Venue Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Venue Statistics
        </h3>
        <div className="grid md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {venues.length}
            </div>
            <div className="text-sm text-gray-600">Total Venues</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {venues.filter((v) => getVenueType(v) === 'outdoor').length}
            </div>
            <div className="text-sm text-gray-600">Outdoor Venues</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {venues.filter((v) => getVenueType(v) === 'indoor').length}
            </div>
            <div className="text-sm text-gray-600">Indoor Venues</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {venues.filter((v) => getVenueType(v) === 'church').length}
            </div>
            <div className="text-sm text-gray-600">Church Venues</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeddingVenueExplorer
