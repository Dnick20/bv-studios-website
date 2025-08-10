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
        price: 1500,
        description: 'Perfect for intimate weddings and elopements',
        features: [
          '4 hours of coverage',
          'Ceremony and reception highlights',
          'Basic editing and color correction',
          'Digital delivery',
          '30-day revision period'
        ],
        deliveryTime: '2-3 weeks',
        popular: false
      },
      {
        id: 2,
        name: 'Premium Wedding Package',
        category: 'premium',
        price: 2500,
        description: 'Comprehensive coverage for your special day',
        features: [
          '8 hours of coverage',
          'Full ceremony and reception',
          'Getting ready footage',
          'Advanced editing and color grading',
          'Multiple camera angles',
          'Drone footage (if applicable)',
          'Digital delivery + USB backup',
          '60-day revision period'
        ],
        deliveryTime: '3-4 weeks',
        popular: true
      },
      {
        id: 3,
        name: 'Luxury Wedding Package',
        category: 'luxury',
        price: 4000,
        description: 'Ultimate wedding video experience',
        features: [
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
          'Consultation and planning session'
        ],
        deliveryTime: '4-6 weeks',
        popular: false
      }
    ]

    // Filter packages by category if specified
    let filteredPackages = allPackages
    if (category) {
      filteredPackages = allPackages.filter(pkg => pkg.category === category)
    }

    return NextResponse.json({
      success: true,
      data: filteredPackages,
      total: filteredPackages.length
    })

  } catch (error) {
    console.error('Wedding Packages API Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
