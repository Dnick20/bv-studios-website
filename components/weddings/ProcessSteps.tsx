'use client'

import { motion } from 'framer-motion'
import { 
  DocumentTextIcon,
  PhoneIcon,
  UserGroupIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

const steps = [
  {
    title: 'Check out the pricing brochure',
    description: 'Take a look at our wedding film packages and find the perfect fit for your special day.',
    icon: DocumentTextIcon,
  },
  {
    title: 'Book a consultation call',
    description: 'Let\'s hop on a quick call to discuss your vision and answer any questions you might have.',
    icon: PhoneIcon,
  },
  {
    title: 'Get to know each other better',
    description: 'We\'ll chat about your story, your wedding plans, and make sure we\'re the perfect match.',
    icon: UserGroupIcon,
  },
  {
    title: 'Book your wedding day',
    description: 'No pressure! If we click, we\'ll make it official and start planning your wedding film.',
    icon: CalendarIcon,
  },
]

export default function ProcessSteps() {
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
    <section className="py-24 bg-wedding-primary/50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-wedding-dark mb-6">
            How We Work Together
          </h2>
          <p className="text-xl text-wedding-text max-w-3xl mx-auto">
            Let's make this journey fun and easy! Here's how we can create your perfect wedding film together.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative"
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-wedding-accent rounded-full flex items-center justify-center text-wedding-dark font-bold shadow-lg">
                {index + 1}
              </div>

              {/* Step Content */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-wedding-accent/20 h-full shadow-lg">
                <div className="w-14 h-14 bg-wedding-accent/10 rounded-lg flex items-center justify-center mb-6">
                  <step.icon className="w-8 h-8 text-wedding-accent" />
                </div>
                <h3 className="text-xl font-semibold text-wedding-dark mb-4">
                  {step.title}
                </h3>
                <p className="text-wedding-text">
                  {step.description}
                </p>
              </div>

              {/* Connector Line (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-wedding-accent/20" />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-4 bg-wedding-accent text-wedding-dark rounded-full font-semibold text-lg shadow-lg hover:bg-wedding-accent/90 transition-all hover:shadow-xl"
          >
            Let's Chat About Your Wedding
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
} 