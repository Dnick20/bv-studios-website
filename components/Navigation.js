'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bars3Icon, XMarkIcon, UserIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

const navItems = [
  { name: 'Home', href: '/#home' },
  { name: 'Services', href: '/#services' },
  { name: 'Weddings', href: '/weddings' },
  { name: 'Portfolio', href: '/#portfolio' },
  { name: 'About', href: '/#about' },
  { name: 'Contact', href: '/#contact' },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showAuthDropdown, setShowAuthDropdown] = useState(false)
  
  // Safely use session with fallback
  const sessionResult = useSession()
  const { data: session, status } = sessionResult || { data: null, status: 'loading' }

  // Handle scroll event to change header background
  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle smooth scrolling for hash links only
  const handleClick = (e) => {
    const href = e.currentTarget.getAttribute('href')
    
    // If it's not a hash link, let the normal navigation happen
    if (!href?.startsWith('#')) return
    
    e.preventDefault()
    const element = document.querySelector(href)
    if (!element) return

    setIsOpen(false) // Close mobile menu
    
    const offset = 80 // Height of fixed header
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }

  // Smart authentication button component
  const AuthButton = () => {
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
                    className="block w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-800 transition-colors"
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
        href="/auth"
        className="px-4 py-2 bg-accent text-primary rounded-full font-medium hover:bg-accent/90 transition-colors"
      >
        Get Started
      </Link>
    )
  }

  // Don't render session-dependent content during SSR
  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link 
              href="/"
              className="text-2xl font-bold text-white hover:text-accent transition-colors"
            >
              BV Studios
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={item.href.startsWith('#') ? handleClick : undefined}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>
        </nav>
      </header>
    )
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-primary/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            href="/"
            className="text-2xl font-bold text-white hover:text-accent transition-colors"
          >
            BV Studios
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={item.href.startsWith('#') ? handleClick : undefined}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Smart Authentication Button */}
            <AuthButton />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile menu */}
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
      </nav>
    </header>
  )
} 