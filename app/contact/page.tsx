'use client'

import Navigation from '@/components/Navigation'
import { useState } from 'react'
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
                  <label htmlFor="service" className="block text-white mb-2">Service Interest</label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-white focus:border-accent focus:outline-none"
                  >
                    <option value="">Select a service</option>
                    <option value="wedding">Wedding Videography</option>
                    <option value="commercial">Commercial Video</option>
                    <option value="brand">Brand Storytelling</option>
                    <option value="other">Other</option>
                  </select>
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
                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-accent text-primary font-semibold rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Contact Information</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{info.title}</h3>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-gray-300 hover:text-accent transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-gray-300">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* FAQ Section */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div className="bg-black/20 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-white mb-2">How far in advance should I book?</h4>
                    <p className="text-gray-300">We recommend booking at least 3-6 months in advance for weddings and 2-4 weeks for commercial projects.</p>
                  </div>
                  <div className="bg-black/20 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-white mb-2">What areas do you serve?</h4>
                    <p className="text-gray-300">We primarily serve Lexington and surrounding areas in Kentucky, but we're happy to travel for special projects.</p>
                  </div>
                  <div className="bg-black/20 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-white mb-2">Do you offer packages?</h4>
                    <p className="text-gray-300">Yes! We offer various packages for both weddings and commercial projects. Contact us for detailed pricing.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Find Us</h2>
            <p className="text-gray-300">Based in Lexington, Kentucky</p>
          </div>
          <div className="aspect-video bg-gradient-to-br from-accent/20 to-primary rounded-xl overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-400">Interactive map coming soon</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 