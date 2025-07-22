'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PlayIcon } from '@heroicons/react/24/solid'
import { mediaUrls } from '@/constants/mediaUrls'

const weddings = [
  {
    couple: 'Sarah & David',
    location: 'Lexington, KY',
    thumbnail: mediaUrls.images.weddings.sarahDavid,
    videoUrl: mediaUrls.videos.weddings.sarahDavid,
  },
  {
    couple: 'Christian & Hailee',
    location: 'Kentucky Castle',
    thumbnail: mediaUrls.images.weddings.christianHailee,
    videoUrl: mediaUrls.videos.weddings.christianHailee,
  },
  {
    couple: 'Kaitlin & Andy',
    location: 'The Bell House',
    thumbnail: mediaUrls.images.weddings.kaitlinAndy,
    videoUrl: mediaUrls.videos.weddings.kaitlinAndy,
  },
  {
    couple: 'Niki & Matt',
    location: 'The Apiary',
    thumbnail: mediaUrls.images.weddings.nikiMatt,
    videoUrl: mediaUrls.videos.weddings.nikiMatt,
  },
]

export default function WeddingPortfolio() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  const handleVideoClick = (videoUrl: string) => {
    setSelectedVideo(videoUrl)
  }

  return (
    <section className="py-24 bg-wedding-secondary/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-wedding-dark mb-6">
            Recent Wedding Films
          </h2>
          <p className="text-xl text-wedding-text max-w-3xl mx-auto">
            Every wedding tells a unique story. Here are some of the beautiful moments 
            we've had the privilege to capture.
          </p>
        </motion.div>

        {/* Wedding Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {weddings.map((wedding, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative aspect-video rounded-2xl overflow-hidden group shadow-lg"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Thumbnail */}
              <img
                src={wedding.thumbnail}
                alt={`${wedding.couple}'s Wedding at ${wedding.location}`}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />

              {/* Overlay */}
              <div 
                className="absolute inset-0 bg-gradient-to-t from-wedding-dark/80 via-wedding-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer backdrop-blur-sm"
                onClick={() => handleVideoClick(wedding.videoUrl)}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: hoveredIndex === index ? 1 : 0.8,
                      opacity: hoveredIndex === index ? 1 : 0
                    }}
                    transition={{ duration: 0.2 }}
                    className="mb-4"
                  >
                    <div className="w-16 h-16 bg-wedding-accent rounded-full flex items-center justify-center shadow-lg">
                      <PlayIcon className="w-8 h-8 text-wedding-dark" />
                    </div>
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-white text-center">
                    {wedding.couple}
                  </h3>
                  <p className="text-wedding-accent mt-2 font-medium">
                    {wedding.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-4 bg-wedding-accent text-wedding-dark rounded-full font-semibold text-lg shadow-lg hover:bg-wedding-accent/90 transition-all hover:shadow-xl"
          >
            View More Wedding Films
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.button>
        </motion.div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-wedding-dark/90 backdrop-blur-sm p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div 
            className="relative w-full max-w-6xl aspect-video bg-wedding-secondary/10 rounded-lg overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <iframe
              src={`${selectedVideo}?autoplay=1&rel=0&modestbranding=1`}
              className="w-full h-full"
              frameBorder="0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </motion.div>
      )}
    </section>
  )
} 