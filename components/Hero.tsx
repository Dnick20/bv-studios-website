'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
      {/* Background Video/Image */}
      <div className="absolute inset-0">
        <Image
          src="/media/images/portfolio/hero.jpg"
          alt="BV Studios Video Production"
          fill
          className="object-cover"
          priority
          quality={95}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-primary" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.05),transparent_70%)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-8"
            >
              <div className="mb-6 inline-block">
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="block h-px w-24 bg-accent mb-8 mx-auto"
                />
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6">
                  Elevate Your Brand with{' '}
                  <span className="text-accent">
                    Expert Video Production
                  </span>
                </h1>
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="block h-px w-24 bg-accent mt-8 mx-auto"
                />
              </div>
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto font-light">
                10X Your Revenue Through Strategic Video Marketing in Lexington, KY
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mt-12"
            >
              <motion.a
                href="#portfolio"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 0 30px rgba(255, 215, 0, 0.2)"
                }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-accent text-primary rounded-none font-medium text-lg shadow-lg transition-all duration-300 hover:bg-accent-light min-w-[200px] tracking-wider uppercase"
              >
                View Our Work
              </motion.a>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-transparent border border-white text-white rounded-none font-medium text-lg hover:bg-white/10 transition-all duration-300 min-w-[200px] tracking-wider uppercase"
              >
                Get Started
              </motion.a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          animate={{ 
            y: [0, 10, 0],
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="flex flex-col items-center">
            <span className="text-accent text-sm tracking-widest uppercase mb-4">Scroll</span>
            <div className="w-px h-12 bg-accent/30">
              <motion.div 
                className="w-full h-1/3 bg-accent"
                animate={{
                  y: [0, 24, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 