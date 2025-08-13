'use client'

import { motion } from 'framer-motion'
import { CameraIcon, FilmIcon, MegaphoneIcon, ChartBarIcon } from '@heroicons/react/24/outline'

export default function Services() {
  const services = [
    {
      icon: CameraIcon,
      title: 'Wedding Videography',
      description: 'Capture your special day with cinematic storytelling and professional editing.',
      features: ['Full day coverage', 'Cinematic editing', 'Drone footage', 'Highlight reel']
    },
    {
      icon: FilmIcon,
      title: 'Commercial Video',
      description: 'Professional video content that drives results for your business.',
      features: ['Brand storytelling', 'Product showcases', 'Marketing campaigns', 'Social media content']
    },
    {
      icon: MegaphoneIcon,
      title: 'Event Coverage',
      description: 'Comprehensive video coverage for corporate events and special occasions.',
      features: ['Corporate events', 'Conferences', 'Product launches', 'Live streaming']
    },
    {
      icon: ChartBarIcon,
      title: 'Content Strategy',
      description: 'Strategic video marketing to grow your brand and increase conversions.',
      features: ['Content planning', 'SEO optimization', 'Analytics tracking', 'ROI measurement']
    }
  ]

  return (
    <section className="py-20 bg-black/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our
            <span className="text-accent block">Services</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Professional video production services tailored to your needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:border-accent/50 transition-colors"
            >
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                <service.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
              <p className="text-gray-300 mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="text-gray-400 text-sm flex items-center">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Audience tiles (light version) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
          <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
            <strong>🏛 Venue Owners</strong>
            <div>Showcase weddings & events held at your location with cinematic reels.</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
            <strong>📈 Marketing Managers</strong>
            <div>Data-driven case studies designed to boost your campaign ROI.</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
            <strong>💙 Nonprofits</strong>
            <div>Impact-driven storytelling to inspire action and amplify your mission.</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
            <strong>🚀 Product Launch Teams</strong>
            <div>High-energy launch films and demos for tech & consumer brands.</div>
          </div>
        </div>
      </div>
    </section>
  )
} 