'use client'

import Navigation from '../../components/Navigation'
import WeddingPortfolio from '../../components/weddings/WeddingPortfolio'
import { 
  CameraIcon, 
  HeartIcon, 
  StarIcon,
  CheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

export default function WeddingsPage() {
  const packages = [
    {
      name: 'Silver Collection',
      price: '$2,200',
      description: 'Perfect for intimate celebrations',
      features: [
        '4 hours of coverage',
        'Short Film',
        'Digital Delivery'
      ]
    },
    {
      name: 'Gold Collection',
      price: '$3,100',
      description: 'Our most popular package',
      features: [
        '6 hours of coverage',
        'Short Film',
        'Ceremony',
        'Instagram Trailer',
        'Digital Delivery'
      ]
    },
    {
      name: 'Diamond Collection',
      price: '$4,500',
      description: 'Complete wedding story',
      featured: true,
      features: [
        '8 hours of coverage',
        'Short Film',
        'Ceremony and Reception Film',
        'Drone Coverage',
        'Instagram Trailer',
        'Digital Delivery'
      ]
    }
  ]

  const extraServices = [
    {
      name: 'Ceremony Film',
      description: 'A 15-20 Minute film of your ceremony with clean recorded audio, color grading, and 2 camera angles',
      price: '$650'
    },
    {
      name: 'Engagement Film',
      description: 'A short creative aside from your wedding film that accompanies your wedding film',
      price: '$650'
    },
    {
      name: 'Additional Hours',
      description: 'Have a long party? Get additional hours so you don\'t miss a thing!',
      price: '$260/hour'
    },
    {
      name: 'Drone Footage',
      description: 'Aerial coverage to capture your venue and special moments from above',
      price: '$650'
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
      
      {/* Hero Section with Wedding Umbrella Background */}
      <section className="relative pt-20 pb-16 min-h-screen flex items-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/media/images/weddings/hero.jpg)'
          }}
        />
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-wedding-dark/40"></div>
        
        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,theme(colors.wedding.accent/0.15),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,theme(colors.wedding.accent/0.1),transparent_70%)]" />
        </div>
        
        <div className="relative container mx-auto px-4 z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-wedding-primary mb-6">
              Wedding
              <span className="text-wedding-accent block">Films</span>
            </h1>
            <p className="text-xl text-wedding-primary/90 mb-8 max-w-2xl mx-auto">
              Capture your special day with cinematic wedding films that tell your unique love story. 
              From engagement shoots to the big day, we preserve your memories beautifully.
            </p>
            <button className="px-8 py-4 bg-wedding-accent text-wedding-dark font-semibold rounded-lg hover:bg-wedding-accent/90 transition-colors shadow-glow">
              View Our Films
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-wedding-primary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-wedding-dark mb-4">Why Choose Our Wedding Films</h2>
            <p className="text-xl text-wedding-muted max-w-2xl mx-auto">
              Professional storytelling that captures your unique love story
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-wedding-accent/20 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-wedding-accent" />
                </div>
                <h3 className="text-xl font-semibold text-wedding-dark mb-4">{feature.title}</h3>
                <p className="text-wedding-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-16 bg-wedding-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-wedding-dark mb-4">Featured Wedding Films</h2>
            <p className="text-xl text-wedding-muted max-w-2xl mx-auto">
              Recent wedding films that showcase our cinematic storytelling
            </p>
          </div>

          <WeddingPortfolio />
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 bg-wedding-primary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-wedding-dark mb-4">Wedding Packages</h2>
            <p className="text-xl text-wedding-muted max-w-2xl mx-auto">
              Choose the perfect package for your special day
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div 
                key={index} 
                className={`relative rounded-xl p-8 border transition-all duration-300 ${
                  pkg.featured 
                    ? 'bg-gradient-to-br from-wedding-accent/20 to-wedding-accent/10 border-wedding-accent shadow-glow-strong scale-105' 
                    : 'bg-wedding-overlay backdrop-blur-sm border-wedding-accent/30 shadow-glow'
                }`}
              >
                {/* Featured Badge */}
                {pkg.featured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-wedding-accent text-wedding-dark px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                      <SparklesIcon className="w-4 h-4 mr-2" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className={`text-2xl font-semibold mb-2 ${pkg.featured ? 'text-wedding-dark' : 'text-wedding-dark'}`}>
                    {pkg.name}
                  </h3>
                  <div className={`text-3xl font-bold mb-2 ${pkg.featured ? 'text-wedding-accent' : 'text-wedding-accent'}`}>
                    {pkg.price}
                  </div>
                  <p className="text-wedding-muted">{pkg.description}</p>
                </div>
                <ul className="space-y-3">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-wedding-muted">
                      <CheckIcon className="w-5 h-5 text-wedding-accent mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full mt-8 px-6 py-3 font-semibold rounded-lg transition-colors ${
                  pkg.featured 
                    ? 'bg-wedding-accent text-wedding-dark hover:bg-wedding-accent/90 shadow-glow' 
                    : 'bg-wedding-accent text-wedding-dark hover:bg-wedding-accent/90 shadow-glow'
                }`}>
                  {pkg.featured ? 'Choose Diamond' : 'Choose Package'}
                </button>
              </div>
            ))}
          </div>

          {/* Extra Services */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-wedding-dark mb-4">Additional Services</h3>
              <p className="text-wedding-muted">Customize your package with these add-ons</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {extraServices.map((service, index) => (
                <div key={index} className="bg-wedding-overlay backdrop-blur-sm rounded-lg p-6 border border-wedding-accent/20">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-wedding-dark font-semibold text-lg">{service.name}</h4>
                    <span className="text-wedding-accent font-bold">{service.price}</span>
                  </div>
                  <p className="text-wedding-muted text-sm">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-wedding-secondary">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-wedding-dark mb-4">
              Ready to Capture Your Love Story?
            </h2>
            <p className="text-xl text-wedding-muted mb-8">
              Let's discuss your wedding vision and create a beautiful film that tells your unique story.
            </p>
            <button className="px-8 py-4 bg-wedding-accent text-wedding-dark font-semibold rounded-lg hover:bg-wedding-accent/90 transition-colors shadow-glow">
              Start Planning
            </button>
          </div>
        </div>
      </section>
    </div>
  )
} 