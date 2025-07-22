'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlayIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { mediaUrls } from '@/constants/mediaUrls'
import Image from 'next/image'

const portfolioItems = [
  {
    title: 'Tim Regus Workspaces',
    description: 'Professional workspace solutions for modern businesses',
    thumbnail: mediaUrls.images.commercial.timRegus,
    videoUrl: mediaUrls.videos.commercial.timRegus,
  },
  {
    title: 'The Lodge at Logan Vineyards',
    description: 'A stunning wedding venue showcasing elegant spaces and beautiful landscapes',
    thumbnail: mediaUrls.images.commercial.lodge,
    videoUrl: mediaUrls.videos.commercial.lodge,
  },
  {
    title: 'Stuttgart Exotic Cars',
    description: 'High-end exotic car shop featuring luxury vehicles and premium service',
    thumbnail: mediaUrls.images.commercial.stuttgart,
    videoUrl: mediaUrls.videos.commercial.stuttgart,
  },
]

export default function Portfolio() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
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
            Recent Work
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Showcasing our finest video productions across various industries
          </motion.p>
        </div>

        {/* Portfolio Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {portfolioItems.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col group"
            >
              {/* Video Thumbnail Container */}
              <motion.div 
                className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer mb-6 border border-accent/10 group-hover:border-accent/30 transition-all duration-300 group-hover:shadow-glow"
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => setSelectedVideo(item.videoUrl)}
                whileHover={{ y: -5 }}
              >
                {/* Thumbnail */}
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                  priority={index < 2}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <motion.div
                      className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow"
                      whileHover={{ scale: 1.1 }}
                    >
                      <PlayIcon className="w-10 h-10 text-primary" />
                    </motion.div>
                    <h3 className="text-2xl font-semibold text-white px-6">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </motion.div>

              {/* Description Box */}
              <div className="bg-black/30 rounded-xl p-6 backdrop-blur-sm border border-accent/10 group-hover:border-accent/30 transition-all duration-300">
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-accent transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Video Modal */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-lg"
              onClick={() => setSelectedVideo(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <iframe
                  src={selectedVideo}
                  className="w-full h-full rounded-2xl shadow-glow-strong"
                  frameBorder="0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  loading="lazy"
                />
                <motion.button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVideo(null);
                  }}
                  className="absolute -top-12 right-0 text-white hover:text-accent transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <XMarkIcon className="w-8 h-8" />
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
} 