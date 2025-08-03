'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { UserIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function MobileMenu({ isOpen, setIsOpen, navItems, handleClick }) {
  const { data: session, status } = useSession()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-primary/95 backdrop-blur-md border-t border-gray-800"
        >
          <div className="px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  if (item.href.startsWith('#')) {
                    handleClick({ currentTarget: { getAttribute: () => item.href }, preventDefault: () => {} })
                  }
                  setIsOpen(false)
                }}
                className="block text-gray-300 hover:text-white transition-colors"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Authentication */}
            <div className="pt-4 border-t border-gray-700">
              {status === 'loading' ? (
                <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
              ) : session ? (
                <div className="space-y-4">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <UserIcon className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: '/' })
                      setIsOpen(false)
                    }}
                    className="w-full text-left text-red-400 hover:text-red-300 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 bg-accent text-primary rounded-full font-medium hover:bg-accent/90 transition-colors text-center"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 