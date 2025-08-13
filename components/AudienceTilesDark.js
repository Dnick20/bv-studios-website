import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AudienceTilesDark() {
  const audiences = [
    {
      icon: '🏛',
      title: 'Venue Owners',
      desc: 'Showcase weddings & events held at your location with cinematic reels.',
    },
    {
      icon: '📈',
      title: 'Marketing Managers',
      desc: 'Data-driven case studies designed to boost your campaign ROI.',
    },
    {
      icon: '💙',
      title: 'Nonprofits',
      desc: 'Impact-driven storytelling to inspire action and amplify your mission.',
    },
    {
      icon: '🚀',
      title: 'Product Launch Teams',
      desc: 'High-energy launch films and demos for tech & consumer brands.',
    },
  ]

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-bold tracking-tight">
            Who We Serve — Beyond the Basics
          </h2>
          <p className="text-gray-300 mt-3">
            We tailor our storytelling to fit the unique needs of your industry.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((a, idx) => (
            <Card
              key={idx}
              className="bg-gray-800 border-gray-700 hover:border-blue-400 hover:shadow-lg transition-all duration-300"
            >
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-semibold text-white">
                  <span className="text-2xl mr-2">{a.icon}</span>
                  {a.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {a.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
