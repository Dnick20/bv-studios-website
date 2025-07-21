'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  VideoCameraIcon, 
  PresentationChartBarIcon, 
  UserGroupIcon, 
  FilmIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline'

type ServiceType = {
  title: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  details: string[];
}

const services: ServiceType[] = [
  {
    title: 'Commercial Videos',
    description: 'High-impact commercials that convert viewers into customers. Professional production for TV, web, and social media advertising.',
    icon: VideoCameraIcon,
    features: ['TV Commercials', 'Product Videos', 'Social Media Ads'],
    details: [
      'Full-service commercial production from concept to delivery',
      'High-end camera equipment and professional crew',
      'Strategic storytelling that drives conversions',
      'Broadcast-quality production standards',
      'Comprehensive post-production and color grading',
      'Multiple format deliverables for different platforms'
    ]
  },
  {
    title: 'Marketing Content',
    description: 'Strategic video content that drives engagement and generates leads. Tailored for your digital marketing campaigns.',
    icon: PresentationChartBarIcon,
    features: ['Social Media Content', 'Educational Videos', 'Video SEO'],
    details: [
      'Platform-optimized content creation',
      'Engagement-focused storytelling',
      'SEO-optimized video production',
      'Regular content scheduling options',
      'Analytics and performance tracking',
      'Multi-platform content strategy'
    ]
  },
  {
    title: 'Event Coverage',
    description: 'Capture the essence of your events with professional videography. From corporate gatherings to special celebrations.',
    icon: UserGroupIcon,
    features: ['Corporate Events', 'Conferences', 'Live Streaming'],
    details: [
      'Multi-camera event coverage',
      'Live streaming capabilities',
      'Real-time editing for same-day highlights',
      'Professional audio capture',
      'Event highlight reels',
      'Full event documentation'
    ]
  },
  {
    title: 'Brand Stories',
    description: 'Compelling narratives that showcase your brand\'s unique story. Connect with your audience on a deeper level.',
    icon: FilmIcon,
    features: ['Company Culture', 'Customer Stories', 'Behind the Scenes'],
    details: [
      'In-depth brand discovery process',
      'Authentic storytelling approach',
      'Customer testimonial production',
      'Company culture documentation',
      'Behind-the-scenes content',
      'Brand voice development'
    ]
  }
]

const ServiceIcon = ({ service }: { service: ServiceType }) => {
  const Icon = service.icon
  return <Icon className="w-6 h-6 text-accent" />
}

export default function Services() {
  const [selectedService, setSelectedService] = useState<number | null>(null)

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  const handleLearnMore = (index: number) => {
    setSelectedService(index)
  }

  const scrollToContact = (service: string) => {
    setSelectedService(null)
    const contactForm = document.getElementById('contact')
    if (contactForm) {
      contactForm.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="py-24 bg-gradient-radial-dark from-primary via-secondary to-primary overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Our Video Production Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Professional video solutions tailored to elevate your brand and engage your audience
          </motion.p>
        </div>

        {/* Services Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-accent/10 hover:border-accent/30 transition-all duration-300 group hover:shadow-glow"
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300">
                  <ServiceIcon service={service} />
                </div>
                <div className="absolute -inset-2 bg-accent/5 rounded-xl blur-xl group-hover:bg-accent/10 transition-colors duration-300" />
              </div>

              <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-accent transition-colors duration-300">
                {service.title}
              </h3>
              
              <p className="text-gray-400 mb-6 group-hover:text-gray-300 transition-colors duration-300">
                {service.description}
              </p>

              <ul className="space-y-3 mb-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="text-gray-300 flex items-center group-hover:text-white transition-colors duration-300">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2 group-hover:shadow-glow" />
                    {feature}
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleLearnMore(index)}
                className="w-full mt-8 py-3 px-4 bg-accent/10 hover:bg-accent/20 text-accent rounded-xl font-medium transition-all duration-300 group-hover:shadow-glow"
              >
                Learn More
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Service Details Modal */}
        <AnimatePresence>
          {selectedService !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
              onClick={() => setSelectedService(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-black/50 backdrop-blur-md rounded-2xl p-8 max-w-2xl w-full border border-accent/20"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mr-4">
                      <ServiceIcon service={services[selectedService]} />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {services[selectedService].title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <p className="text-gray-300">
                    {services[selectedService].description}
                  </p>

                  <div>
                    <h4 className="text-lg font-semibold text-accent mb-3">
                      What's Included:
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {services[selectedService].details.map((detail, idx) => (
                        <li key={idx} className="text-gray-300 flex items-center">
                          <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => scrollToContact(services[selectedService].title)}
                    className="w-full py-4 bg-accent text-primary rounded-xl font-medium mt-8 hover:bg-accent-light transition-all duration-300"
                  >
                    Get Started with {services[selectedService].title}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}