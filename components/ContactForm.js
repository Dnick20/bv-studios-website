'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { analytics } from '../lib/analytics'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [formStarted, setFormStarted] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (!formStarted) {
      setFormStarted(true)
      analytics.contactFormStarted()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Track form submission attempt
    analytics.contactFormSubmitted(formData)
    analytics.leadGenerated('contact_form', 'inquiry', formData)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message')
      }

      // Success
      alert(result.message || 'Thank you for your message! We\'ll get back to you soon.')
      setFormData({ name: '', email: '', message: '' })
      setFormStarted(false)

    } catch (error) {
      console.error('Contact form submission error:', error)
      alert('Sorry, there was an error sending your message. Please try again or contact us directly.')
    }
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Get In
            <span className="text-accent block">Touch</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Ready to start your project? Let's discuss your vision and bring it to life.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">Send Us a Message</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-accent focus:outline-none"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-accent focus:outline-none"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-white mb-2">Message *</label>
                <textarea
                  rows={6}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-accent focus:outline-none"
                  placeholder="Tell us about your project..."
                  required
                ></textarea>
              </div>
              <motion.button
                type="submit"
                className="w-full py-4 bg-accent text-primary font-bold rounded-lg hover:bg-accent/90 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-6 bg-black/20 rounded-lg border border-gray-800">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                  <EnvelopeIcon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Email</h4>
                  <a href="mailto:info@bvstudios.com" className="text-gray-300 hover:text-accent transition-colors">
                    info@bvstudios.com
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-6 bg-black/20 rounded-lg border border-gray-800">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                  <PhoneIcon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Phone</h4>
                  <a href="tel:+18595550123" className="text-gray-300 hover:text-accent transition-colors">
                    (859) 555-0123
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-6 bg-black/20 rounded-lg border border-gray-800">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                  <MapPinIcon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Location</h4>
                  <p className="text-gray-300">Lexington, Kentucky</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 