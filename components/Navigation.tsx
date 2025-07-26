'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const isWeddingPage = pathname?.startsWith('/weddings')
  const textColorClass = isWeddingPage ? 'text-wedding-primary' : 'text-white'
  const hoverColorClass = isWeddingPage ? 'hover:text-wedding-accent' : 'hover:text-accent'

  return (
    <nav className={`fixed w-full z-50 ${isWeddingPage ? 'bg-wedding-dark/95' : 'bg-primary/95'} backdrop-blur-sm`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className={`text-xl font-bold ${textColorClass}`}>
            BV Studios
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/weddings" className={`${textColorClass} ${hoverColorClass} transition-colors`}>
              Weddings
            </Link>
            <Link href="/commercial" className={`${textColorClass} ${hoverColorClass} transition-colors`}>
              Commercial
            </Link>
            <Link href="/about" className={`${textColorClass} ${hoverColorClass} transition-colors`}>
              About
            </Link>
            <Link href="/contact" className={`${textColorClass} ${hoverColorClass} transition-colors`}>
              Contact
            </Link>
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={`${textColorClass} ${hoverColorClass} transition-colors`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className={`${isWeddingPage ? 'bg-wedding-accent text-wedding-dark' : 'bg-accent text-primary'} px-4 py-2 rounded-lg hover:opacity-90 transition-opacity`}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login"
                  className={`${textColorClass} ${hoverColorClass} transition-colors`}
                >
                  Login
                </Link>
                <Link
                  href="/login"
                  className={`${isWeddingPage ? 'bg-wedding-accent text-wedding-dark' : 'bg-accent text-primary'} px-4 py-2 rounded-lg hover:opacity-90 transition-opacity`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
          >
            <span className="sr-only">Open menu</span>
            <div className="relative w-6 h-5">
              <span 
                className={`absolute h-0.5 w-6 transform transition duration-300 ease-in-out ${isWeddingPage ? 'bg-wedding-primary' : 'bg-white'} ${isOpen ? 'rotate-45 translate-y-2.5' : ''}`}
              />
              <span 
                className={`absolute h-0.5 w-6 transform transition duration-300 ease-in-out ${isWeddingPage ? 'bg-wedding-primary' : 'bg-white'} top-2 ${isOpen ? 'opacity-0' : ''}`}
              />
              <span 
                className={`absolute h-0.5 w-6 transform transition duration-300 ease-in-out ${isWeddingPage ? 'bg-wedding-primary' : 'bg-white'} top-4 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden ${isWeddingPage ? 'bg-wedding-dark' : 'bg-primary'}`}
          >
            <div className="px-4 pt-2 pb-4 space-y-3">
              <Link href="/weddings" className={`block ${textColorClass} ${hoverColorClass} transition-colors`}>
                Weddings
              </Link>
              <Link href="/commercial" className={`block ${textColorClass} ${hoverColorClass} transition-colors`}>
                Commercial
              </Link>
              <Link href="/about" className={`block ${textColorClass} ${hoverColorClass} transition-colors`}>
                About
              </Link>
              <Link href="/contact" className={`block ${textColorClass} ${hoverColorClass} transition-colors`}>
                Contact
              </Link>
              {user ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className={`block ${textColorClass} ${hoverColorClass} transition-colors`}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className={`block w-full text-left ${textColorClass} ${hoverColorClass} transition-colors`}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login"
                    className={`block ${textColorClass} ${hoverColorClass} transition-colors`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/login"
                    className={`block ${textColorClass} ${hoverColorClass} transition-colors`}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
} 