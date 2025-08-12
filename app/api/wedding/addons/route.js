import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    // Mock wedding addons data - replace with actual database query
  const allAddons = [
      {
        id: 101,
        name: 'Ceremony Film',
        category: 'film',
        price: 65000, // $650
        description:
          'A 15-20 minute film of your ceremony with clean recorded audio, color grading, and two cameras',
        features: [
          'Two cameras',
          'Clean recorded audio',
          'Color grading',
        ],
        duration: '15-20 minutes',
        popular: true,
      },
      {
        id: 102,
        name: 'Engagement Film',
        category: 'film',
        price: 65000, // $650
        description:
          'A short creative film aside from your wedding film that accompanies your story',
        features: ['Creative session', 'Story-driven', 'Graded delivery'],
        duration: '2-3 minutes',
        popular: true,
      },
      {
        id: 103,
        name: 'Additional Hours',
        category: 'coverage',
        price: 26000, // $260 per hour
        description: "Add more hours of coverage so you don't miss a thing",
        features: ['Per hour add-on'],
        duration: 'Per hour',
        popular: true,
      },
      {
        id: 104,
        name: 'Drone Footage',
        category: 'aerial',
        price: 65000, // $650
        description:
          'Aerial coverage to capture your venue and special moments from above',
        features: ['FAA compliant', '4K aerial footage'],
        duration: '1-2 hours',
        popular: true,
      },
    ]

    // Filter addons by category if specified
    let filteredAddons = allAddons
    if (category) {
      filteredAddons = allAddons.filter((addon) => addon.category === category)
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
