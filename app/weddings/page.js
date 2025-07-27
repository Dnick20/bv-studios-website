'use client'

import Navigation from '../../components/Navigation'
import { motion } from 'framer-motion'
import { 
  HeartIcon, 
  CameraIcon, 
  ClockIcon, 
  CheckIcon,
  StarIcon,
  UserGroupIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline'

export default function WeddingsPage() {
  const packages = [
    {
      name: 'Essential',
      price: '$1,500',
      description: 'Perfect for intimate ceremonies',
      features: [
        '4 hours of coverage',
        'Ceremony & reception highlights',
        '50 edited photos',
        '5-minute highlight video',
        'Online gallery',
        'Delivery in 2 weeks'
      ]
    },
    {
      name: 'Classic',
      price: '$2,500',
      description: 'Most popular choice for traditional weddings',
      features: [
        '8 hours of coverage',
        'Getting ready to grand exit',
        '100 edited photos',
        '10-minute highlight video',
        'Full ceremony video',
        'Online gallery',
        'Delivery in 3 weeks'
      ]
    },
    {
      name: 'Premium',
      price: '$3,500',
      description: 'Complete coverage for your special day',
      features: [
        'Full day coverage (12 hours)',
        'Getting ready to grand exit',
        '150 edited photos',
        '15-minute highlight video',
        'Full ceremony & reception videos',
        'Engagement session included',
        'Online gallery',
        'Delivery in 4 weeks'
      ]
    }
  ]

  const processSteps = [
    {
      icon: HeartIcon,
      title: 'Consultation',
      description: 'We discuss your vision, timeline, and package options to create the perfect plan for your special day.'
    },
    {
      icon: CameraIcon,
      title: 'Pre-Wedding',
      description: 'Engagement session and final planning meeting to ensure everything is perfect for your wedding day.'
    },
    {
      icon: VideoCameraIcon,
      title: 'Wedding Day',
      description: 'Professional coverage of your entire wedding day, from getting ready to the grand exit.'
    },
    {
      icon: StarIcon,
      title: 'Editing',
      description: 'Careful editing and color grading to create beautiful, timeless memories of your special day.'
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
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold text-white mb-6"
            >
              Wedding
              <span className="text-accent block">Cinematography</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              Capturing your love story with cinematic beauty. Every moment, every emotion, 
              every detail preserved forever in stunning high-definition video.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <a 
                href="#packages" 
                className="inline-block px-8 py-4 bg-accent text-primary font-semibold rounded-lg hover:bg-accent/90 transition-colors"
              >
                View Packages
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Our Process</h2>
            <p className="text-xl text-gray-300">How we bring your wedding vision to life</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-16 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Wedding Packages</h2>
            <p className="text-xl text-gray-300">Choose the perfect package for your special day</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:border-accent/50 transition-colors"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                  <div className="text-3xl font-bold text-accent mb-2">{pkg.price}</div>
                  <p className="text-gray-300">{pkg.description}</p>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckIcon className="w-5 h-5 text-accent flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <a 
                  href="/contact" 
                  className="block w-full text-center px-6 py-3 bg-accent text-primary font-semibold rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Get Started
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Your Story?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Let's discuss your vision and create a custom package that perfectly captures your special day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="px-8 py-4 bg-accent text-primary font-semibold rounded-lg hover:bg-accent/90 transition-colors"
              >
                Contact Us
              </a>
              <a 
                href="/#portfolio" 
                className="px-8 py-4 border border-accent text-accent font-semibold rounded-lg hover:bg-accent hover:text-primary transition-colors"
              >
                View Portfolio
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
} 