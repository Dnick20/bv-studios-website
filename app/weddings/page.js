'use client'

import Navigation from '../../components/Navigation'
import WeddingPortfolio from '../../components/weddings/WeddingPortfolio'
import { 
  CameraIcon, 
  HeartIcon, 
  StarIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

export default function WeddingsPage() {
  const packages = [
    {
      name: 'Essential',
      price: '$1,500',
      description: 'Perfect for intimate celebrations',
      features: [
        '4 hours of coverage',
        'Cinematic highlight film (3-5 min)',
        'Full ceremony edit',
        'Online gallery',
        'USB delivery'
      ]
    },
    {
      name: 'Classic',
      price: '$2,500',
      description: 'Our most popular package',
      features: [
        '8 hours of coverage',
        'Cinematic highlight film (5-8 min)',
        'Full ceremony edit',
        'Reception highlights',
        'Engagement session',
        'Online gallery',
        'USB delivery'
      ]
    },
    {
      name: 'Premium',
      price: '$3,500',
      description: 'Complete wedding story',
      features: [
        'Full day coverage',
        'Cinematic highlight film (8-12 min)',
        'Full ceremony edit',
        'Reception highlights',
        'Engagement session',
        'Getting ready footage',
        'Online gallery',
        'USB delivery',
        'Drone footage'
      ]
    }
  ]

  const features = [
    {
      icon: CameraIcon,
      title: 'Cinematic Storytelling',
      description: 'We capture your love story with cinematic techniques that make your wedding film feel like a movie.'
    },
    {
      icon: HeartIcon,
      title: 'Emotional Connection',
      description: 'Our films focus on the genuine moments and emotions that make your day truly special.'
    },
    {
      icon: StarIcon,
      title: 'Premium Quality',
      description: 'Professional equipment and editing ensure your wedding film is of the highest quality.'
    }
  ]

  return (
    <div className="min-h-screen bg-primary">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/10 to-primary"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Wedding
              <span className="text-accent block">Films</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Capture your special day with cinematic wedding films that tell your unique love story. 
              From engagement shoots to the big day, we preserve your memories beautifully.
            </p>
            <button className="px-8 py-4 bg-accent text-primary font-semibold rounded-lg hover:bg-accent/90 transition-colors">
              View Our Films
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose Our Wedding Films</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Professional storytelling that captures your unique love story
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Featured Wedding Films</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Recent wedding films that showcase our cinematic storytelling
            </p>
          </div>

          <WeddingPortfolio />
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Wedding Packages</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose the perfect package for your special day
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div key={index} className="bg-black/30 backdrop-blur-sm rounded-xl p-8 border border-gray-800">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-semibold text-white mb-2">{pkg.name}</h3>
                  <div className="text-3xl font-bold text-accent mb-2">{pkg.price}</div>
                  <p className="text-gray-300">{pkg.description}</p>
                </div>
                <ul className="space-y-3">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-300">
                      <CheckIcon className="w-5 h-5 text-accent mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full mt-8 px-6 py-3 bg-accent text-primary font-semibold rounded-lg hover:bg-accent/90 transition-colors">
                  Choose Package
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Capture Your Love Story?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Let's discuss your wedding vision and create a beautiful film that tells your unique story.
            </p>
            <button className="px-8 py-4 bg-accent text-primary font-semibold rounded-lg hover:bg-accent/90 transition-colors">
              Start Planning
            </button>
          </div>
        </div>
      </section>
    </div>
  )
} 