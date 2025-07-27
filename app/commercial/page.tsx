'use client'

import Navigation from '@/components/Navigation'
import {
  PlayIcon,
  CameraIcon,
  FilmIcon,
  MegaphoneIcon,
  ChartBarIcon,
  UsersIcon
} from '@heroicons/react/24/outline'
import { mediaUrls } from '@/constants/mediaUrls'

export default function CommercialPage() {
  const services = [
    {
      icon: CameraIcon,
      title: 'Brand Storytelling',
      description: 'Crafting compelling narratives that resonate with your audience and build brand loyalty.',
      features: ['Brand documentaries', 'Company profiles', 'Mission statements']
    },
    {
      icon: FilmIcon,
      title: 'Product Showcases',
      description: 'Highlighting your products with engaging visuals and clear demonstrations.',
      features: ['Product demos', 'Explainer videos', 'Unboxing videos']
    },
    {
      icon: MegaphoneIcon,
      title: 'Marketing Campaigns',
      description: 'Strategic video content designed to boost conversions and brand awareness.',
      features: ['Multi-platform content', 'Conversion optimization', 'ROI tracking']
    }
  ]

  const process = [
    { step: 1, title: 'Discovery', description: 'Understand your brand, goals, and target audience.' },
    { step: 2, title: 'Strategy', description: 'Develop a tailored video concept and production plan.' },
    { step: 3, title: 'Production', description: 'Filming and capturing all necessary footage.' },
    { step: 4, title: 'Post-Production', description: 'Editing, color grading, sound design, and final touches.' }
  ]

  const commercialVideos = [
    {
      id: 1,
      title: 'The Lodge at Logan',
      description: 'Luxury hospitality brand showcase',
      thumbnail: mediaUrls.images.commercial.lodge,
      videoUrl: mediaUrls.videos.commercial.lodge,
      duration: '2:15'
    },
    {
      id: 2,
      title: 'Stuttgart Motors',
      description: 'Classic car restoration and sales',
      thumbnail: mediaUrls.images.commercial.stuttgart,
      videoUrl: mediaUrls.videos.commercial.stuttgart,
      duration: '3:42'
    },
    {
      id: 3,
      title: 'Tim Regus',
      description: 'Real estate and property management',
      thumbnail: mediaUrls.images.commercial.timRegus,
      videoUrl: mediaUrls.videos.commercial.timRegus,
      duration: '4:18'
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
              Commercial Video
              <span className="text-accent block">Production</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              From brand storytelling to product showcases, we create compelling videos that convert.
            </p>
            <button className="px-8 py-4 bg-accent text-primary font-semibold rounded-lg hover:bg-accent/90 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Services</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Comprehensive video production services tailored to your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:border-accent/50 transition-colors"
              >
                <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                  <service.icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">{service.title}</h3>
                <ul className="space-y-2 text-gray-300">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Featured Commercial Videos</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Recent commercial projects that showcase our professional video production
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {commercialVideos.map((video) => (
              <div
                key={video.id}
                className="group relative bg-black/30 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800 hover:border-accent/50 transition-colors cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-accent/90 rounded-full flex items-center justify-center group-hover:bg-accent transition-colors">
                      <PlayIcon className="w-8 h-8 text-primary" />
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-sm px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">{video.title}</h3>
                  <p className="text-gray-300 text-sm">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Process</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              A streamlined approach to delivering exceptional video content
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-xl">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
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
              Ready to Elevate Your Brand?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Let's create compelling video content that drives results for your business.
            </p>
            <button className="px-8 py-4 bg-accent text-primary font-semibold rounded-lg hover:bg-accent/90 transition-colors">
              Start Your Project
            </button>
          </div>
        </div>
      </section>
    </div>
  )
} 