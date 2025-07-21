'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function WeddingHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/media/images/weddings/joel-overbeck-fGPGd9PFd3w-unsplash.jpg"
          alt="Beautiful wedding moment captured in natural light"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-wedding-dark/50 via-wedding-dark/30 to-wedding-primary" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,198,198,0.1),transparent_70%)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-wedding-primary leading-tight mb-6">
            Let's Get This Wedding (Videography) Party Started!
          </h1>
          <p className="text-xl md:text-2xl text-wedding-primary/90 mb-8">
            Hey, my name is Dominic! Super happy you've considered me to capture your wedding day and love story.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-4 bg-wedding-accent text-wedding-dark rounded-full font-semibold text-lg shadow-lg hover:bg-wedding-accent/90 transition-all hover:shadow-xl"
          >
            Book a Consultation Call
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ 
            y: [0, 10, 0],
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-6 h-10 border-2 border-wedding-accent/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-wedding-accent/50 rounded-full mt-2" />
          </div>
        </motion.div>
      </div>
    </section>
  )
} 