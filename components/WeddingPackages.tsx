'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Dialog } from '@headlessui/react'

interface IntakeFormData {
  name: string
  email: string
  phone: string
  weddingDate: string
  venue: string
  message: string
}

export default function WeddingPackages() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<IntakeFormData>({
    name: '',
    email: '',
    phone: '',
    weddingDate: '',
    venue: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData)
    setIsModalOpen(false)
    // Show success message or handle response
  }

  const packages = [
    {
      name: 'The Diamond Collection',
      price: '$6,500',
      features: [
        '8 Hours of Coverage',
        'Short Film',
        'Ceremony and Reception Film',
        'Drone Coverage',
        'Instagram Trailer',
        'Digital Delivery'
      ],
      isHighlighted: true
    },
    {
      name: 'The Gold Collection',
      price: '$3,100',
      features: [
        '6 Hours of Coverage',
        'Short Film',
        'Ceremony',
        'Instagram Trailer',
        'Digital Delivery'
      ],
      isHighlighted: false
    },
    {
      name: 'The Silver Collection',
      price: '$2,200',
      features: [
        '4 Hours of Coverage',
        'Short Film',
        'Digital Delivery'
      ],
      isHighlighted: false
    }
  ]

  const extras = [
    {
      name: 'Ceremony Film',
      price: '$650',
      description: 'A 15-20 minute film of your ceremony with clean recorded audio, color grading, and 2 camera angles'
    },
    {
      name: 'Engagement Film',
      price: '$650',
      description: 'A short creative film that beautifully accompanies your wedding film'
    },
    {
      name: 'Additional Hours',
      price: '$350/Hour',
      description: "Have a long party? Get additional hours so you don't miss a thing!"
    },
    {
      name: 'Drone Footage',
      price: '$1,000',
      description: 'Stunning aerial shots that add cinematic beauty to your wedding film'
    }
  ]

  return (
    <section className="relative bg-gradient-to-b from-primary to-secondary overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center text-center">
        <div className="absolute inset-0">
          <Image
            src="/media/images/weddings/hero.jpg"
            alt="Wedding Videography"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-playfair font-bold text-white mb-6"
          >
            BV Studios Weddings
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 mb-8"
          >
            Packages starting from $2,200
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 rounded-full
              font-semibold hover:bg-white/30 transition-all duration-300 hover:scale-105"
          >
            View Full Pricing Brochure
          </motion.button>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="container mx-auto px-4 py-24">
        <h2 className="text-4xl md:text-5xl font-playfair text-center text-white mb-16">
          Wedding Video Packages
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-2xl p-8 ${
                pkg.isHighlighted 
                  ? 'bg-gradient-to-br from-amber-300 to-amber-500 text-gray-900'
                  : 'bg-white/10 backdrop-blur-sm text-white'
              }`}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent/50" />
              <h3 className="text-2xl font-playfair font-bold mb-4">{pkg.name}</h3>
              <p className="text-4xl font-bold mb-8">{pkg.price}</p>
              <ul className="space-y-4 mb-8">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <span className="mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setIsModalOpen(true)}
                className={`w-full py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
                  pkg.isHighlighted
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                Get Started
              </button>
            </motion.div>
          ))}
        </div>

        {/* Extras Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 mb-24">
          <h2 className="text-4xl font-playfair text-center text-white mb-12">
            The Extras
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {extras.map((extra, index) => (
              <motion.div
                key={extra.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
              >
                <h3 className="text-xl font-playfair text-white mb-2">{extra.name}</h3>
                <p className="text-2xl font-bold text-accent mb-4">{extra.price}</p>
                <p className="text-white/80">{extra.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Intake Form Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl bg-white rounded-2xl p-8">
            <Dialog.Title className="text-3xl font-playfair font-bold text-gray-900 mb-6">
              Request Pricing Brochure
            </Dialog.Title>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wedding Date
                  </label>
                  <input
                    type="date"
                    value={formData.weddingDate}
                    onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue (if known)
                </label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Details
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent"
                  placeholder="Tell us about your vision for your wedding video..."
                />
              </div>
              
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </section>
  )
} 