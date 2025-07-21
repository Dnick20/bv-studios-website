'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { 
  ClockIcon, 
  ChartBarIcon, 
  MapPinIcon,
  UserGroupIcon,
  VideoCameraIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

const benefits = [
  {
    title: '10+ Years Experience',
    description: 'Decade of expertise in creating compelling video content that drives results.',
    icon: ClockIcon,
  },
  {
    title: 'ROI-Focused Approach',
    description: 'Strategic video marketing that delivers measurable business outcomes.',
    icon: ChartBarIcon,
  },
  {
    title: 'Local Lexington Expertise',
    description: 'Deep understanding of the Kentucky market and local business landscape.',
    icon: MapPinIcon,
  },
]

const stats = [
  {
    value: '100+',
    label: 'Happy Clients',
    icon: UserGroupIcon,
  },
  {
    value: '500+',
    label: 'Videos Produced',
    icon: VideoCameraIcon,
  },
  {
    value: '10X',
    label: 'Average ROI',
    icon: CurrencyDollarIcon,
  },
]

const team = [
  {
    name: 'Dominic Lewis',
    role: 'Founder & Lead Cinematographer',
    image: '/media/images/team/Dominic.png',
    bio: 'With over a decade of experience in video production, Dominic brings a unique blend of technical expertise and creative vision to every project. His passion for storytelling through video has helped countless businesses elevate their brand presence.',
    specialties: ['Commercial Production', 'Wedding Cinematography', 'Brand Storytelling']
  },
  {
    name: 'Deisy Lewis',
    role: 'Creative Director & Photographer',
    image: '/media/images/team/Deisy.jpg',
    bio: 'As Creative Director and Photographer, Deisy brings an innovative perspective to every project. Her eye for detail and understanding of visual storytelling helps create compelling narratives that resonate with audiences. Her photography expertise adds another dimension to our visual storytelling capabilities.',
    specialties: ['Creative Direction', 'Photography', 'Visual Storytelling', 'Project Management']
  }
]

export default function About() {
  const statsRef = useRef(null)
  const isInView = useInView(statsRef, { once: true, margin: "-100px" })

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
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
    <section className="py-24 bg-gradient-to-b from-secondary to-primary overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Why Choose BV Studios?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Your trusted partner in creating impactful video content that drives real business results
          </motion.p>
        </div>

        {/* Benefits Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-800"
            >
              <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                <benefit.icon className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                {benefit.title}
              </h3>
              <p className="text-gray-300">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Company Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold text-white">Our Story</h3>
            <p className="text-gray-300 leading-relaxed">
              Founded in 2014, BV Studios has been at the forefront of video production in Lexington, Kentucky. 
              What started as a passion for storytelling has grown into a full-service video production company 
              trusted by leading brands across the region.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Our mission is simple: create compelling video content that not only tells your story but drives 
              measurable business results. With our deep understanding of digital marketing and local market dynamics, 
              we've helped hundreds of businesses transform their video marketing strategy.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative aspect-video rounded-2xl overflow-hidden bg-black/30 backdrop-blur-sm border border-accent/20"
          >
            <Image
              src="/media/images/team/Dominic.png"
              alt="Dominic Lewis - BV Studios Founder"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="text-white font-medium text-xl">The BV Studios Team</p>
              <p className="text-accent">Crafting Your Story Through Video</p>
            </div>
          </motion.div>
        </div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Meet the Team</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our talented team brings together expertise in cinematography, storytelling, and creative direction 
              to deliver exceptional video content.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-accent/10 hover:border-accent/30 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-accent/20">
                    {member.image && (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-semibold text-white mb-2">{member.name}</h4>
                    <p className="text-accent mb-4">{member.role}</p>
                    <p className="text-gray-300 mb-4">{member.bio}</p>
                    <div className="flex flex-wrap gap-2">
                      {member.specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <div 
          ref={statsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-6">
                <stat.icon className="w-8 h-8 text-accent" />
              </div>
              <motion.p 
                className="text-4xl md:text-5xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                {stat.value}
              </motion.p>
              <p className="text-gray-300 text-lg">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 