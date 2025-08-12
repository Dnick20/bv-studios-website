'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { HomeIcon, CameraIcon } from '@heroicons/react/24/outline'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-radial from-accent/5 via-primary to-primary pointer-events-none" />
      
      <div className="relative text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* 404 Number */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-9xl md:text-[12rem] font-bold text-accent/20 leading-none">
              404
            </h1>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-lg mx-auto">
              Sorry, the page you're looking for doesn't exist. It may have been moved, deleted, or you may have typed the URL incorrectly.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-accent text-primary rounded-lg font-semibold hover:bg-accent/90 transition-all duration-300 shadow-glow"
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            
            <Link
              href="/#portfolio"
              className="inline-flex items-center px-6 py-3 bg-transparent border border-accent text-accent rounded-lg font-semibold hover:bg-accent/10 transition-all duration-300"
            >
              <CameraIcon className="w-5 h-5 mr-2" />
              View Our Work
            </Link>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-12 pt-8 border-t border-gray-800"
          >
            <p className="text-gray-400 mb-4">Or visit one of these pages:</p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Link href="/#services" className="text-gray-300 hover:text-accent transition-colors">
                Services
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="/weddings" className="text-gray-300 hover:text-accent transition-colors">
                Wedding Films
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="/#about" className="text-gray-300 hover:text-accent transition-colors">
                About Us
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="/#contact" className="text-gray-300 hover:text-accent transition-colors">
                Contact
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}