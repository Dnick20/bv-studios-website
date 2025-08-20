'use client'

import { Navigation } from '../../../lib/imports.js'
import { motion } from 'framer-motion'
import { EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen bg-primary">
      <Navigation />

      <div className="pt-20 pb-16 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/30 backdrop-blur-sm rounded-xl p-8 border border-gray-800 text-center"
          >
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-8 h-8 text-green-400" />
              </div>
            </div>

            {/* Header */}
            <h1 className="text-2xl font-bold text-white mb-4">
              Check Your Email
            </h1>

            <p className="text-gray-300 mb-6">
              A sign in link has been sent to your email address.
            </p>

            {/* Email Icon */}
            <div className="flex justify-center mb-6">
              <EnvelopeIcon className="w-12 h-12 text-gray-400" />
            </div>

            {/* Instructions */}
            <div className="text-left space-y-3 mb-6">
              <p className="text-gray-300 text-sm">
                If you don't see it, check your spam folder. The link will
                expire in 24 hours.
              </p>

              <p className="text-gray-300 text-sm">
                You can close this window and return to it once you've clicked
                the link in your email.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <a
                href="/auth/signin"
                className="w-full block py-3 bg-accent text-primary font-semibold rounded-lg hover:bg-accent/90 transition-colors"
              >
                Back to Sign In
              </a>

              <a
                href="/"
                className="w-full block py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
              >
                Go Home
              </a>
            </div>

            {/* Help Text */}
            <p className="text-gray-400 text-sm mt-6">
              Need help? Contact our support team.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
