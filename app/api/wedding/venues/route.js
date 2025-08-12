import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location')
    const capacity = searchParams.get('capacity')

    // Mock wedding venues data - replace with actual database query
    const allVenues = [
      {
        id: 1,
        name: 'Kentucky Horse Park',
        location: 'Lexington, KY',
        address: '4089 Iron Works Pkwy, Lexington, KY 40511',
        capacity: 300,
        description: 'Beautiful outdoor venue with rolling hills and horse farm views',
        features: ['Outdoor ceremony', 'Indoor reception', 'Parking', 'Bridal suite'],
        priceRange: '$$',
        images: [
          '/images/venues/kentucky-horse-park-1.jpg',
          '/images/venues/kentucky-horse-park-2.jpg'
        ],
        coordinates: { lat: 38.1334, lng: -84.5067 }
      },
      {
        id: 2,
        name: 'Gratz Park Inn',
        location: 'Lexington, KY',
        address: '120 W 2nd St, Lexington, KY 40507',
        capacity: 150,
        description: 'Historic boutique hotel in downtown Lexington',
        features: ['Indoor ceremony', 'Indoor reception', 'Hotel rooms', 'Valet parking'],
        priceRange: '$$$',
        images: [
          '/images/venues/gratz-park-inn-1.jpg',
          '/images/venues/gratz-park-inn-2.jpg'
        ],
        coordinates: { lat: 38.0463, lng: -84.4973 }
      },
      {
        id: 3,
        name: 'Keeneland',
        location: 'Lexington, KY',
        address: '4201 Versailles Rd, Lexington, KY 40510',
        capacity: 500,
        description: 'Iconic horse racing venue with elegant facilities',
        features: ['Indoor/outdoor options', 'Multiple venues', 'Catering', 'Event planning'],
        priceRange: '$$$$',
        images: [
          '/images/venues/keeneland-1.jpg',
          '/images/venues/keeneland-2.jpg'
        ],
        coordinates: { lat: 38.0497, lng: -84.6049 }
      },
      {
        id: 4,
        name: 'The Barn at Shaker Village',
        location: 'Harrodsburg, KY',
        address: '3501 Lexington Rd, Harrodsburg, KY 40330',
        capacity: 200,
        description: 'Rustic barn venue with modern amenities',
        features: ['Barn ceremony', 'Outdoor options', 'Catering kitchen', 'Bridal suite'],
        priceRange: '$$',
        images: [
          '/images/venues/shaker-village-1.jpg',
          '/images/venues/shaker-village-2.jpg'
        ],
        coordinates: { lat: 37.8231, lng: -84.8477 }
      },
      // Additional venues shown on Weddings page
      {
        id: 5,
        name: 'The Stone House at Silver Creek',
        location: 'Berea, KY',
        address: '',
        capacity: 200,
        description: 'Historic stone house venue at Silver Creek',
        features: ['Indoor/Outdoor', 'Historic site'],
        priceRange: '$$',
        url: 'https://thestonehouseatsilvercreek.com',
        email: 'bookings@thestonehouseatsilvercreek.com',
      },
      {
        id: 6,
        name: 'Silo Farms',
        location: 'Shelby County, KY',
        address: '',
        capacity: 250,
        description: 'Rustic event barn with modern construction',
        features: ['Barn', 'Lake views'],
        priceRange: '$$',
        url: 'https://silofarmsky.com/',
      },
      {
        id: 7,
        name: 'Barn at 7 Gables',
        location: 'Kentucky',
        address: '',
        capacity: 200,
        description: 'Rustic barn at Seven Gables Farm & Orchard',
        features: ['Barn', 'Rustic'],
        priceRange: '$$',
        url: 'https://www.facebook.com/p/Barn-at-Seven-Gables-Farm-and-Orchard-Venue-100039614774879/',
      },
      {
        id: 8,
        name: 'Copper Roux',
        location: 'Lexington, KY',
        address: '861 S Broadway #110, Lexington, KY 40504',
        capacity: 180,
        description: 'Elegant venue by Bayou Bluegrass Catering',
        features: ['Catering', 'Indoor reception'],
        priceRange: '$$$',
        url: 'https://bayoubluegrass.com/copper-roux/',
      }
    ]

    // Filter venues based on query parameters
    let filteredVenues = allVenues

    if (location) {
      filteredVenues = filteredVenues.filter(venue => 
        venue.location.toLowerCase().includes(location.toLowerCase())
      )
    }

    if (capacity) {
      const minCapacity = parseInt(capacity)
      filteredVenues = filteredVenues.filter(venue => venue.capacity >= minCapacity)
    }

    return NextResponse.json({
      success: true,
      data: filteredVenues,
      venues: filteredVenues, // for booking page convenience
      total: filteredVenues.length,
      filters: { location, capacity }
    })

  } catch (error) {
    console.error('Wedding Venues API Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
