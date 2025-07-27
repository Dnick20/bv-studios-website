'use client'

import { motion } from 'framer-motion'
import { PlayIcon, EyeIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function Portfolio() {
  const [selectedVideo, setSelectedVideo] = useState(null)

  const portfolioItems = [
    {
      title: 'Wedding Highlights',
      category: 'Wedding',
      image: '/images/optimized/weddings/niki-matt.webp',
      description: 'Beautiful wedding cinematography capturing special moments',
      videoUrl: 'https://www.youtube.com/embed/SRBc8SJ3jLk',
      thumbnail: '/images/optimized/weddings/niki-matt.webp'
    },
    {
      title: 'Commercial Production',
      category: 'Commercial',
      image: '/images/optimized/commercial/stuttgart.webp',
      description: 'Professional commercial video production for businesses',
      videoUrl: 'https://www.youtube.com/embed/isO7D5PLyRo',
      thumbnail: '/images/optimized/commercial/stuttgart.webp'
    },
    {
      title: 'Real Estate & Events',
      category: 'Real Estate',
      image: '/images/optimized/commercial/tim-regus.webp',
      description: 'Professional real estate videography and event coverage',
      videoUrl: 'https://www.youtube.com/embed/XqX9JotLUb0',
      thumbnail: '/images/optimized/commercial/tim-regus.webp'
    }
  ]

  const openVideo = (videoUrl) => {
    setSelectedVideo(videoUrl)
  }

  const closeVideo = () => {
    setSelectedVideo(null)
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
              className="group relative overflow-hidden rounded-xl bg-black/30 border border-gray-800 hover:border-accent/50 transition-all duration-300"
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-transparent"></div>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => openVideo(item.videoUrl)}
                    className="group/btn relative"
                  >
                    <div className="w-20 h-20 bg-accent/90 rounded-full flex items-center justify-center group-hover/btn:bg-accent transition-colors duration-300">
                      <PlayIcon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="absolute inset-0 w-20 h-20 bg-accent/20 rounded-full animate-ping"></div>
                  </button>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-accent/90 text-primary text-sm font-medium rounded-full">
                    {item.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{item.description}</p>
                
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => openVideo(item.videoUrl)}
                    className="flex items-center space-x-2 text-accent hover:text-accent-light transition-colors"
                  >
                    <PlayIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Watch Video</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                    <EyeIcon className="w-4 h-4" />
                    <span className="text-sm">View Details</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Video Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl">
              <button
                onClick={closeVideo}
                className="absolute -top-12 right-0 text-white hover:text-accent transition-colors text-2xl"
              >
                ✕
              </button>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={selectedVideo}
                  title="Portfolio Video"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
} 