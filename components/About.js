'use client'

import { motion } from 'framer-motion'
import { UserIcon, StarIcon, TrophyIcon, FilmIcon } from '@heroicons/react/24/outline'

export default function About() {
  const stats = [
    { number: '150+', label: 'Videos Produced', icon: FilmIcon },
    { number: '50+', label: 'Happy Clients', icon: UserIcon },
    { number: '8+', label: 'Years Experience', icon: TrophyIcon },
    { number: '100%', label: 'Client Satisfaction', icon: StarIcon }
  ]

  return (
    <section className="py-20 bg-black/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About
              <span className="text-accent block">BV Studios</span>
            </h2>
            <p className="text-lg text-gray-300 mb-6">
              We're passionate about creating compelling video content that tells your story and drives real business results. 
              Based in Lexington, Kentucky, we serve clients throughout the region with professional video production services.
            </p>
            <p className="text-lg text-gray-300 mb-8">
              From intimate wedding ceremonies to high-impact commercial campaigns, we approach each project with the same 
              level of dedication and attention to detail that has made us a trusted partner for businesses and couples alike.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className="text-center p-6 bg-black/30 rounded-xl border border-gray-800"
              >
                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
} 