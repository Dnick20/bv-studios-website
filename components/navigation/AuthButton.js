'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function AuthButton() {
  const [showAuthDropdown, setShowAuthDropdown] = useState(false)
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
    )
  }

  if (session) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowAuthDropdown(!showAuthDropdown)}
          className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
        >
          <UserIcon className="w-5 h-5" />
          <span>Dashboard</span>
          <ChevronDownIcon className="w-4 h-4" />
        </button>
        
        <AnimatePresence>
          {showAuthDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-sm rounded-lg border border-gray-700 shadow-lg"
            >
              <div className="py-2">
                <Link
                  href="/dashboard"
                  onClick={() => setShowAuthDropdown(false)}
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  My Dashboard
                </Link>
                <button
                  onClick={() => {
                    signOut({ callbackUrl: '/' })
                    setShowAuthDropdown(false)
                  }}
                  className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-800 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <Link
      href="/auth/signin"
      className="px-4 py-2 bg-accent text-primary rounded-full font-medium hover:bg-accent/90 transition-colors"
    >
      Get Started
    </Link>
  )
} 