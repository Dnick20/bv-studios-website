'use client'

import { motion } from 'framer-motion'
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline'

export default function PricingPreview() {
  return (
    <section className="py-24 bg-gradient-to-b from-secondary to-primary overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Wedding Film Packages
            </h2>
            <p className="text-xl text-gray-300">
              Every love story is unique, and so are our wedding film packages. 
              Download our brochure to find the perfect fit for your special day.
            </p>
          </motion.div>

          {/* Pricing Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-gray-800"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  What's Included:
                </h3>
                <ul className="space-y-4">
                  {[
                    'Full-day coverage options',
                    'Highlight films & feature films',
                    'Raw footage options',
                    'Drone coverage available',
                    'Multiple camera setups',
                    'Professional audio recording',
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center text-gray-300"
                    >
                      <svg className="w-5 h-5 text-accent mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="text-center">
                <p className="text-gray-300 mb-6">
                  Packages starting from
                </p>
                <div className="text-5xl font-bold text-white mb-8">
                  $2,499
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-8 py-4 bg-accent text-primary rounded-full font-semibold text-lg shadow-lg hover:shadow-accent/20 transition-shadow w-full justify-center"
                >
                  <DocumentArrowDownIcon className="w-6 h-6 mr-2" />
                  View Full Pricing Brochure
                </motion.button>
                <p className="text-sm text-gray-400 mt-4">
                  Want to discuss custom options? Book a consultation call!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 