'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bars3Icon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import AuthButton from './navigation/AuthButton'
import MobileMenu from './navigation/MobileMenu'

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

  if (!mounted) {
    return null
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-primary/95 backdrop-blur-sm border-b border-gray-800' : 'bg-transparent'
    }`}>
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
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
            
            {/* Optimized Authentication Button */}
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

        {/* Optimized Mobile Menu */}
        <MobileMenu 
          isOpen={isOpen} 
          setIsOpen={setIsOpen} 
          navItems={navItems} 
          handleClick={handleClick} 
        />
      </nav>
    </header>
  )
} 