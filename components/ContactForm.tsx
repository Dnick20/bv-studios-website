'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon 
} from '@heroicons/react/24/outline'

type FormData = {
  name: string
  email: string
  phone: string
  projectType: string
  message: string
}

type FormErrors = {
  [key in keyof FormData]?: string
}

const projectTypes = [
  'Commercial Video',
  'Brand Story',
  'Event Coverage',
  'Marketing Content',
  'Social Media Content',
  'Other',
]

const contactInfo = [
  {
    icon: PhoneIcon,
    label: 'Call Us',
    value: '(859) 555-0123',
    href: 'tel:+18595550123',
  },
  {
    icon: EnvelopeIcon,
    label: 'Email',
    value: 'hello@bvstudios.com',
    href: 'mailto:hello@bvstudios.com',
  },
  {
    icon: MapPinIcon,
    label: 'Locally',
    value: 'Lexington, KY',
    href: 'https://maps.google.com/?q=Lexington,+KY',
  },
]

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    message: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number'
    }

    if (!formData.projectType) {
      newErrors.projectType = 'Please select a project type'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
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
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulated API call
      setSubmitSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        projectType: '',
        message: '',
      })
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <section className="py-24 bg-gradient-to-b from-primary to-secondary overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Ready to Elevate Your Brand?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Let's discuss how we can help you achieve your video marketing goals
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-800"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-black/30 border ${
                    errors.name ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg focus:outline-none focus:border-accent text-white`}
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className={`w-full px-4 py-3 bg-black/30 border ${
                      errors.email ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg focus:outline-none focus:border-accent text-white`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

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
                    className={`w-full px-4 py-3 bg-black/30 border ${
                      errors.phone ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg focus:outline-none focus:border-accent text-white`}
                    placeholder="(859) 555-0123"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="projectType" className="block text-sm font-medium text-gray-300 mb-2">
                  Project Type
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-black/30 border ${
                    errors.projectType ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg focus:outline-none focus:border-accent text-white`}
                >
                  <option value="">Select a project type</option>
                  {projectTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.projectType && (
                  <p className="mt-1 text-sm text-red-500">{errors.projectType}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-3 bg-black/30 border ${
                    errors.message ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg focus:outline-none focus:border-accent text-white`}
                  placeholder="Tell us about your project"
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                )}
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
                {isSubmitting ? 'Sending...' : 'Get Free Consultation'}
              </motion.button>

              {submitSuccess && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-500 text-center mt-4"
                >
                  Thank you! We'll be in touch soon.
                </motion.p>
              )}
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8 lg:pl-8"
          >
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={index}
                  href={info.href}
                  target={info.icon === MapPinIcon ? '_blank' : undefined}
                  rel={info.icon === MapPinIcon ? 'noopener noreferrer' : undefined}
                  className="flex items-start space-x-4 p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-gray-800 hover:border-accent/50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <info.icon className="w-6 h-6 text-accent" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">{info.label}</p>
                    <p className="text-white mt-1">{info.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
              <h3 className="text-xl font-semibold text-white mb-4">
                Office Hours
              </h3>
              <div className="space-y-2 text-gray-300">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: By appointment</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 