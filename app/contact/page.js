'use client'

import { Suspense } from 'react'
import Navigation from '../../components/Navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactInfo = [
    {
      icon: EnvelopeIcon,
      title: 'Email',
      value: 'info@bvstudios.com',
      link: 'mailto:info@bvstudios.com'
    },
    {
      icon: PhoneIcon,
      title: 'Phone',
      value: '(859) 555-0123',
      link: 'tel:+18595550123'
    },
    {
      icon: MapPinIcon,
      title: 'Location',
      value: 'Lexington, Kentucky',
      link: null
    },
    {
      icon: ClockIcon,
      title: 'Hours',
      value: 'Mon-Fri: 9AM-6PM',
      link: null
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
              Get In
              <span className="text-accent block">Touch</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Ready to start your project? Let's discuss your vision and bring it to life.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-white mb-2">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-accent focus:outline-none"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-white mb-2">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-accent focus:outline-none"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-white mb-2">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-accent focus:outline-none"
                      placeholder="(859) 555-0123"
                    />
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-white mb-2">Service *</label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white focus:border-accent focus:outline-none"
                    >
                      <option value="">Select a service</option>
                      <option value="wedding">Wedding Video</option>
                      <option value="commercial">Commercial Video</option>
                      <option value="event">Event Coverage</option>
                      <option value="corporate">Corporate Video</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-white mb-2">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-accent focus:outline-none"
                    placeholder="Tell us about your project..."
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
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Contact Information</h2>
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-4 p-6 bg-black/20 rounded-lg border border-gray-800"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{item.title}</h3>
                      {item.link ? (
                        <a
                          href={item.link}
                          className="text-gray-300 hover:text-accent transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-gray-300">{item.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* FAQ Section */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div className="p-6 bg-black/20 rounded-lg border border-gray-800">
                    <h4 className="text-white font-semibold mb-2">How long does a typical project take?</h4>
                    <p className="text-gray-300">Most projects take 2-4 weeks from start to finish, depending on complexity and scope.</p>
                  </div>
                  <div className="p-6 bg-black/20 rounded-lg border border-gray-800">
                    <h4 className="text-white font-semibold mb-2">What's included in your packages?</h4>
                    <p className="text-gray-300">All packages include pre-production planning, filming, editing, color grading, and final delivery.</p>
                  </div>
                  <div className="p-6 bg-black/20 rounded-lg border border-gray-800">
                    <h4 className="text-white font-semibold mb-2">Do you travel for projects?</h4>
                    <p className="text-gray-300">Yes! We're based in Lexington but travel throughout Kentucky and surrounding states.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 