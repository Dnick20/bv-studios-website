import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    // Mock wedding packages data - replace with actual database query
    const allPackages = [
      {
        id: 1,
        name: 'Standard Wedding Package',
        category: 'basic',
        // Use cents to match UI formatter (price / 100)
        price: 150000,
        duration: 4,
        description: 'Perfect for intimate weddings and elopements',
        // UI attempts JSON.parse first; provide JSON string for compatibility
        features: JSON.stringify([
          '4 hours of coverage',
          'Ceremony and reception highlights',
          'Basic editing and color correction',
          'Digital delivery',
          '30-day revision period',
        ]),
        deliveryTime: '2-3 weeks',
        popular: false,
      },
      {
        id: 2,
        name: 'Premium Wedding Package',
        category: 'premium',
        price: 250000,
        duration: 8,
        description: 'Comprehensive coverage for your special day',
        features: JSON.stringify([
          '8 hours of coverage',
          'Full ceremony and reception',
          'Getting ready footage',
          'Advanced editing and color grading',
          'Multiple camera angles',
          'Drone footage (if applicable)',
          'Digital delivery + USB backup',
          '60-day revision period',
        ]),
        deliveryTime: '3-4 weeks',
        popular: true,
      },
      {
        id: 3,
        name: 'Luxury Wedding Package',
        category: 'luxury',
        price: 400000,
        duration: 12,
        description: 'Ultimate wedding video experience',
        features: JSON.stringify([
          '12 hours of coverage',
          'Multi-day coverage available',
          'Cinematic storytelling approach',
          'Professional color grading',
          'Multiple camera setup',
          'Drone and gimbal footage',
          'Wedding trailer (30-60 seconds)',
          'Full feature film (60-90 minutes)',
          'Digital delivery + USB + Blu-ray',
          '90-day revision period',
          'Consultation and planning session',
        ]),
        deliveryTime: '4-6 weeks',
        popular: false,
      },
    ]

    // Filter packages by category if specified
    let filteredPackages = allPackages
    if (category) {
      filteredPackages = allPackages.filter((pkg) => pkg.category === category)
    }

    return NextResponse.json({
      success: true,
      data: filteredPackages,
      // Also return packages field for the booking page's expected shape
      packages: filteredPackages,
      total: filteredPackages.length,
    })
  } catch (error) {
    console.error('Wedding Packages API Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
