'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import PortfolioItem from './portfolio/PortfolioItem'
import VideoModal from './portfolio/VideoModal'

export default function Portfolio() {
  const [selectedVideo, setSelectedVideo] = useState(null)

  const portfolioItems = [
    {
      title: 'Wedding Highlights',
      category: 'Wedding',
      image: '/images/portfolio/wedding-highlights.webp',
      description: 'Beautiful wedding cinematography capturing special moments',
      videoUrl: 'https://www.youtube.com/embed/SRBc8SJ3jLk',
      thumbnail: '/images/portfolio/wedding-highlights.webp'
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
            <PortfolioItem
              key={index}
              item={item}
              index={index}
              onVideoOpen={openVideo}
            />
          ))}
        </div>
      </div>

      {/* Optimized Video Modal */}
      <VideoModal
        isOpen={!!selectedVideo}
        videoUrl={selectedVideo}
        onClose={closeVideo}
      />
    </section>
  )
} 