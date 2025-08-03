'use client'

import { motion } from 'framer-motion'
import { PlayIcon } from '@heroicons/react/24/outline'

export default function PortfolioItem({ item, index, onVideoOpen }) {
  return (
    <motion.div
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
            onClick={() => onVideoOpen(item.videoUrl)}
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
        <p className="text-gray-300">{item.description}</p>
      </div>
    </motion.div>
  )
} 