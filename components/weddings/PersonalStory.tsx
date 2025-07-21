'use client'

import { motion } from 'framer-motion'

export default function PersonalStory() {
  return (
    <section className="py-24 bg-wedding-secondary overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-wedding-dark mb-8">
            Thanks for Considering Me!
          </h2>
          
          <div className="prose prose-lg mx-auto">
            <p className="text-xl text-wedding-text leading-relaxed">
              Discovering how people met and what brought them to this moment is important to me. 
              Giving you a wedding film that tells your story and showcases the day in an authentic 
              way is my goal. I would be honored to capture the special moments that make up your 
              wedding day and document your commitment to one another.
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="mt-12 flex items-center justify-center space-x-4">
            <div className="h-px w-12 bg-wedding-accent/30" />
            <svg className="w-8 h-8 text-wedding-accent/50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <div className="h-px w-12 bg-wedding-accent/30" />
          </div>
        </motion.div>
      </div>
    </section>
  )
} 