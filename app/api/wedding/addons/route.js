import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    // Mock wedding addons data - replace with actual database query
    const allAddons = [
      {
        id: 1,
        name: 'Drone Coverage',
        category: 'aerial',
        // Use cents to match UI formatter (price / 100)
        price: 30000,
        description: 'Beautiful aerial shots of your venue and ceremony',
        features: [
          'Aerial venue shots',
          'Ceremony overview',
          'Group photos from above',
          'HD quality footage'
        ],
        duration: '1-2 hours',
        popular: true
      },
      {
        id: 2,
        name: 'Photo Slideshow',
        category: 'media',
        price: 15000,
        description: 'Create a beautiful slideshow with your photos and video clips',
        features: [
          'Photo integration',
          'Custom music selection',
          'Smooth transitions',
          'Digital delivery'
        ],
        duration: '3-5 minutes',
        popular: false
      },
      {
        id: 3,
        name: 'Same Day Edit',
        category: 'rush',
        price: 50000,
        description: 'Get a highlight video ready for your reception',
        features: [
          'Quick turnaround',
          'Reception highlights',
          'Basic editing',
          'Same day delivery'
        ],
        duration: '2-3 minutes',
        popular: false
      },
      {
        id: 4,
        name: 'Additional Hours',
        category: 'coverage',
        price: 20000,
        description: 'Extend your coverage time for more comprehensive filming',
        features: [
          'Extra filming time',
          'More footage captured',
          'Extended editing',
          'Flexible scheduling'
        ],
        duration: 'Per hour',
        popular: true
      },
      {
        id: 5,
        name: 'Wedding Trailer',
        category: 'media',
        price: 25000,
        description: 'Short cinematic trailer perfect for social media',
        features: [
          'Cinematic style',
          'Social media ready',
          'Custom length',
          'Professional editing'
        ],
        duration: '30-60 seconds',
        popular: true
      },
      {
        id: 6,
        name: 'Guest Messages',
        category: 'interactive',
        price: 10000,
        description: 'Record messages from your wedding guests',
        features: [
          'Guest interviews',
          'Well wishes captured',
          'Integrated into final video',
          'Memorable keepsake'
        ],
        duration: 'Throughout event',
        popular: false
      }
    ]

    // Filter addons by category if specified
    let filteredAddons = allAddons
    if (category) {
      filteredAddons = allAddons.filter(addon => addon.category === category)
    }

    return NextResponse.json({
      success: true,
      data: filteredAddons,
      addons: filteredAddons, // booking page expects `addons`
      total: filteredAddons.length,
      category: category || 'all',
    })

  } catch (error) {
    console.error('Wedding Addons API Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
