'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { analytics } from '../lib/analytics'

const AnalyticsProvider = ({ children }) => {
  const pathname = usePathname()

  useEffect(() => {
    // Track page views on route changes
    const pageName = getPageName(pathname)
    analytics.pageView(pageName, {
      path: pathname,
      timestamp: new Date().toISOString()
    })

    // Track performance metrics
    if (typeof window !== 'undefined') {
      // Page load time
      window.addEventListener('load', () => {
        const loadTime = performance.now()
        analytics.performanceMetric('page_load_time', loadTime, {
          page: pageName,
          path: pathname
        })
      })

      // Track errors
      window.addEventListener('error', (event) => {
        analytics.errorOccurred('javascript_error', event.message, {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          page: pageName
        })
      })

      // Track unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        analytics.errorOccurred('unhandled_promise_rejection', event.reason?.toString() || 'Unknown error', {
          page: pageName
        })
      })
    }
  }, [pathname])

  // Track user interactions globally
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Track scroll depth
      let maxScroll = 0
      const handleScroll = () => {
        const scrollPercent = Math.round(
          (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        )
        if (scrollPercent > maxScroll) {
          maxScroll = scrollPercent
          if (scrollPercent >= 25 && scrollPercent < 50) {
            analytics.userEngagement('scroll_25_percent', { page: getPageName(pathname) })
          } else if (scrollPercent >= 50 && scrollPercent < 75) {
            analytics.userEngagement('scroll_50_percent', { page: getPageName(pathname) })
          } else if (scrollPercent >= 75) {
            analytics.userEngagement('scroll_75_percent', { page: getPageName(pathname) })
          }
        }
      }

      // Track time on page
      const startTime = Date.now()
      const handleBeforeUnload = () => {
        const timeOnPage = Date.now() - startTime
        analytics.userEngagement('time_on_page', { 
          duration: timeOnPage,
          page: getPageName(pathname)
        })
      }

      // Track clicks on links and buttons
      const handleClick = (event) => {
        const target = event.target
        const tagName = target.tagName.toLowerCase()
        
        if (tagName === 'a') {
          const href = target.getAttribute('href')
          const text = target.textContent?.trim() || 'Unknown link'
          analytics.navigationClick(text, href || 'unknown')
        } else if (tagName === 'button' || target.getAttribute('role') === 'button') {
          const text = target.textContent?.trim() || target.getAttribute('aria-label') || 'Unknown button'
          analytics.userEngagement('button_click', {
            button_text: text,
            page: getPageName(pathname)
          })
        }
      }

      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('beforeunload', handleBeforeUnload)
      document.addEventListener('click', handleClick)

      return () => {
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('beforeunload', handleBeforeUnload)
        document.removeEventListener('click', handleClick)
      }
    }
  }, [pathname])

  return children
}

// Helper function to get readable page names
const getPageName = (pathname) => {
  const pageNames = {
    '/': 'Home',
    '/weddings': 'Weddings',
    '/commercial': 'Commercial',
    '/about': 'About',
    '/contact': 'Contact',
    '/wedding-booking': 'Wedding Booking',
    '/my-quotes': 'My Quotes',
    '/dashboard': 'Customer Dashboard',
    '/admin': 'Admin Login',
    '/admin/dashboard': 'Admin Dashboard',
    '/auth': 'Authentication',
    '/auth/signin': 'Sign In',
    '/auth/signup': 'Sign Up'
  }

  return pageNames[pathname] || pathname.replace('/', '').replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown Page'
}

export default AnalyticsProvider