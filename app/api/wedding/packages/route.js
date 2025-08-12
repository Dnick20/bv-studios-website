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
        name: 'Silver Collection',
        category: 'silver',
        price: 210000, // $2,100
        duration: 4,
        description: 'Perfect for intimate celebrations',
        features: JSON.stringify([
          '4 hours of coverage',
          'Short Film',
          'Digital Delivery',
        ]),
        deliveryTime: '2-3 weeks',
        popular: false,
      },
      {
        id: 2,
        name: 'Gold Collection',
        category: 'gold',
        price: 350000, // $3,500
        duration: 6,
        description: 'Our most popular package',
        features: JSON.stringify([
          '6 hours of coverage',
          'Short Film',
          'Ceremony',
          'Instagram Trailer',
          'Digital Delivery',
        ]),
        deliveryTime: '3-4 weeks',
        popular: true,
      },
      {
        id: 3,
        name: 'Diamond Collection',
        category: 'diamond',
        price: 620000, // $6,200
        duration: 8,
        description: 'Complete wedding story',
        features: JSON.stringify([
          '8 hours of coverage',
          'Short Film',
          'Ceremony and Reception Film',
          'Drone Coverage',
          'Instagram Trailer',
          'Digital Delivery',
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
