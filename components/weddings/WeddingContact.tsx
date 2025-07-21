'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

type FormData = {
  names: string
  email: string
  phone: string
  date: string
  venue: string
  message: string
}

type FormErrors = {
  [key in keyof FormData]?: string
}

export default function WeddingContact() {
  const [formData, setFormData] = useState<FormData>({
    names: '',
    email: '',
    phone: '',
    date: '',
    venue: '',
    message: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.names.trim()) {
      newErrors.names = 'Names are required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }

    if (!formData.date.trim()) {
      newErrors.date = 'Wedding date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Replace with your actual form submission logic
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSubmitSuccess(true)
      setFormData({
        names: '',
        email: '',
        phone: '',
        date: '',
        venue: '',
        message: '',
      })
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <section className="py-24 bg-gradient-to-b from-primary to-secondary overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Chat?
            </h2>
            <p className="text-xl text-gray-300">
              Let's talk about your wedding day! Fill out the form below and I'll get back to you within 24 hours.
            </p>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-gray-800"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="names" className="block text-sm font-medium text-gray-300 mb-2">
                    Your Names
                  </label>
                  <input
                    type="text"
                    id="names"
                    name="names"
                    value={formData.names}
                    onChange={handleChange}
                    placeholder="e.g., Sarah & James"
                    className={`w-full px-4 py-3 bg-black/30 border ${
                      errors.names ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg focus:outline-none focus:border-accent text-white`}
                  />
                  {errors.names && (
                    <p className="mt-1 text-sm text-red-500">{errors.names}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={`w-full px-4 py-3 bg-black/30 border ${
                      errors.email ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg focus:outline-none focus:border-accent text-white`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(859) 555-0123"
                    className={`w-full px-4 py-3 bg-black/30 border ${
                      errors.phone ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg focus:outline-none focus:border-accent text-white`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">
                    Wedding Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-black/30 border ${
                      errors.date ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg focus:outline-none focus:border-accent text-white`}
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-500">{errors.date}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="venue" className="block text-sm font-medium text-gray-300 mb-2">
                  Venue (if known)
                </label>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="Wedding venue or location"
                  className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:border-accent text-white"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Tell me about your wedding!
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Share your vision, questions, or anything else you'd like me to know!"
                  className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:border-accent text-white"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
                  isSubmitting 
                    ? 'bg-accent/50 cursor-not-allowed' 
                    : 'bg-accent hover:bg-accent/90'
                } text-primary`}
              >
                {isSubmitting ? 'Sending...' : 'Book Your Consultation'}
              </motion.button>

              {submitSuccess && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-500 text-center mt-4"
                >
                  Thanks! I'll be in touch within 24 hours to schedule your consultation.
                </motion.p>
              )}
            </form>

            <div className="mt-8 pt-8 border-t border-gray-800">
              <p className="text-center text-gray-400">
                No pressure - take your time to decide! You can also reach me directly at{' '}
                <a href="mailto:dominic@bvstudios.com" className="text-accent hover:text-accent/80 transition-colors">
                  dominic@bvstudios.com
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 