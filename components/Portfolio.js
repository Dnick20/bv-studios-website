'use client'

import { motion } from 'framer-motion'
import { PlayIcon } from '@heroicons/react/24/outline'

export default function Portfolio() {
  const portfolioItems = [
    {
      title: 'Wedding Highlights',
      category: 'Wedding',
      image: '/media/images/portfolio/wedding-1.jpg',
      videoUrl: 'https://www.youtube.com/embed/example1'
    },
    {
      title: 'Commercial Spot',
      category: 'Commercial',
      image: '/media/images/portfolio/commercial-1.jpg',
      videoUrl: 'https://www.youtube.com/embed/example2'
    },
    {
      title: 'Event Coverage',
      category: 'Event',
      image: '/media/images/portfolio/event-1.jpg',
      videoUrl: 'https://www.youtube.com/embed/example3'
    }
  ]

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
            Our
            <span className="text-accent block">Portfolio</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Showcasing our best work across different video production categories
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className="group relative overflow-hidden rounded-xl bg-black/30 border border-gray-800"
            >
              <div className="aspect-video relative">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/80"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <PlayIcon className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="p-6">
                <span className="text-accent text-sm font-medium">{item.category}</span>
                <h3 className="text-xl font-bold text-white mt-2">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 