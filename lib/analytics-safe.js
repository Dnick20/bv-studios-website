// PostHog Analytics for Wedding Booking System - Safe Version
import posthog from 'posthog-js'

// Initialize PostHog (client-side only) with error handling
if (typeof window !== 'undefined') {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  
  // Only initialize PostHog if we have a real API key (not demo)
  if (posthogKey && posthogKey !== 'phc_demo_key_replace_with_real_key' && !posthogKey.includes('demo') && posthogKey.length > 20) {
    try {
      posthog.init(posthogKey, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
        session_recording: { enabled: true, recordCrossOriginIframes: false },
        capture_pageview: true,
        capture_performance: true,
        debug: process.env.NODE_ENV === 'development'
      })
    } catch (error) {
      console.warn('PostHog initialization failed:', error.message)
    }
  } else {
    console.log('📊 PostHog Analytics: Using environment variables.')
  }
}

// Helper function to safely capture events
const safeCapture = (eventName, properties) => {
  if (typeof window !== 'undefined' && typeof posthog !== 'undefined' && posthog && posthog.capture) {
    try {
      posthog.capture(eventName, properties)
    } catch (error) {
      console.warn('PostHog capture failed:', error.message)
    }
  } else {
    // In demo mode, log events to console for testing
    console.log(`📊 Analytics Event: ${eventName}`, properties)
  }
}

// Wedding-specific analytics events
export const weddingAnalytics = {
  packageViewed: (packageData) => {
    safeCapture('Wedding Package Viewed', {
      package_id: packageData.id,
      package_name: packageData.name,
      package_price: packageData.price,
      package_duration: packageData.duration,
      package_features: packageData.features?.length || 0,
      price_tier: packageData.price < 250000 ? 'budget' : 
                 packageData.price < 350000 ? 'mid-range' : 'premium',
      page_url: typeof window !== 'undefined' ? window.location.href : '',
      timestamp: new Date().toISOString()
    })
  },

  packageSelected: (packageData) => {
    safeCapture('Wedding Package Selected', {
      package_id: packageData.id,
      package_name: packageData.name,
      package_price: packageData.price,
      selection_time: Date.now(),
      page_url: typeof window !== 'undefined' ? window.location.href : ''
    })
  },

  addonViewed: (addonData) => {
    safeCapture('Wedding Addon Viewed', {
      addon_id: addonData.id,
      addon_name: addonData.name,
      addon_price: addonData.price,
      addon_category: addonData.category,
      page_url: typeof window !== 'undefined' ? window.location.href : ''
    })
  },

  addonAdded: (addonData, selectedPackage) => {
    safeCapture('Wedding Addon Added', {
      addon_id: addonData.id,
      addon_name: addonData.name,
      addon_price: addonData.price,
      addon_category: addonData.category,
      base_package: selectedPackage?.name,
      page_url: typeof window !== 'undefined' ? window.location.href : ''
    })
  },

  addonRemoved: (addonData, selectedPackage) => {
    safeCapture('Wedding Addon Removed', {
      addon_id: addonData.id,
      addon_name: addonData.name,
      base_package: selectedPackage?.name,
      page_url: typeof window !== 'undefined' ? window.location.href : ''
    })
  },

  venueViewed: (venueData) => {
    safeCapture('Wedding Venue Viewed', {
      venue_id: venueData.id,
      venue_name: venueData.name,
      venue_city: venueData.city,
      venue_state: venueData.state,
      page_url: typeof window !== 'undefined' ? window.location.href : ''
    })
  },

  venueSelected: (venueData) => {
    safeCapture('Wedding Venue Selected', {
      venue_id: venueData.id,
      venue_name: venueData.name,
      venue_type: venueData.description?.includes('outdoor') ? 'outdoor' : 'indoor',
      venue_city: venueData.city,
      page_url: typeof window !== 'undefined' ? window.location.href : ''
    })
  },

  customVenueSelected: (venueName) => {
    safeCapture('Custom Wedding Venue Selected', {
      custom_venue_name: venueName,
      venue_type: 'custom',
      page_url: typeof window !== 'undefined' ? window.location.href : ''
    })
  },

  quoteStarted: (packageData) => {
    safeCapture('Wedding Quote Started', {
      package_id: packageData?.id,
      package_name: packageData?.name,
      package_price: packageData?.price,
      funnel_step: 1,
      page_url: typeof window !== 'undefined' ? window.location.href : '',
      session_start: Date.now()
    })
  },

  quoteFormFilled: (fieldName, value) => {
    safeCapture('Wedding Quote Form Progress', {
      field_name: fieldName,
      field_filled: true,
      funnel_step: 2,
      page_url: typeof window !== 'undefined' ? window.location.href : ''
    })
  },

  quoteSubmitted: (quoteData) => {
    safeCapture('Wedding Quote Submitted', {
      quote_id: quoteData.id,
      package_id: quoteData.packageId,
      total_price: quoteData.totalPrice,
      guest_count: quoteData.guestCount,
      event_date: quoteData.eventDate,
      event_time: quoteData.eventTime,
      venue_type: quoteData.venueId ? 'preset' : 'custom',
      addons_count: quoteData.addons?.length || 0,
      funnel_step: 3,
      conversion_complete: true,
      page_url: typeof window !== 'undefined' ? window.location.href : ''
    })
  },

  pageView: (pageName, additionalData = {}) => {
    safeCapture('Wedding Page View', {
      page_name: pageName,
      page_url: typeof window !== 'undefined' ? window.location.href : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      viewport_width: typeof window !== 'undefined' ? window.innerWidth : 0,
      viewport_height: typeof window !== 'undefined' ? window.innerHeight : 0,
      ...additionalData
    })
  },

  userEngagement: (action, duration = null) => {
    safeCapture('Wedding User Engagement', {
      engagement_action: action,
      engagement_duration: duration,
      page_url: typeof window !== 'undefined' ? window.location.href : '',
      timestamp: new Date().toISOString()
    })
  },

  conversionAbandoned: (step, reason = null) => {
    safeCapture('Wedding Conversion Abandoned', {
      abandonment_step: step,
      abandonment_reason: reason,
      page_url: typeof window !== 'undefined' ? window.location.href : '',
      session_duration: typeof sessionStorage !== 'undefined' ? 
        Date.now() - (sessionStorage.getItem('session_start') || Date.now()) : 0
    })
  },

  performanceMetric: (metric, value) => {
    safeCapture('Wedding Site Performance', {
      metric_name: metric,
      metric_value: value,
      page_url: typeof window !== 'undefined' ? window.location.href : '',
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
    })
  }
}

export const analyticsHelpers = {
  startTimer: (eventName) => {
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(`timer_${eventName}`, Date.now().toString())
    }
  },

  endTimer: (eventName) => {
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      const startTime = sessionStorage.getItem(`timer_${eventName}`)
      if (startTime) {
        const duration = Date.now() - parseInt(startTime)
        sessionStorage.removeItem(`timer_${eventName}`)
        return duration
      }
    }
    return null
  },

  identifyUser: (userEmail, properties = {}) => {
    if (typeof window !== 'undefined' && typeof posthog !== 'undefined' && posthog && posthog.identify) {
      try {
        posthog.identify(userEmail, {
          email: userEmail,
          first_visit: new Date().toISOString(),
          ...properties
        })
      } catch (error) {
        console.warn('PostHog identify failed:', error.message)
      }
    } else {
      console.log('📊 User Identified:', userEmail, properties)
    }
  },

  setUserProperty: (property, value) => {
    if (typeof window !== 'undefined' && typeof posthog !== 'undefined' && posthog && posthog.people) {
      try {
        posthog.people.set({ [property]: value })
      } catch (error) {
        console.warn('PostHog set property failed:', error.message)
      }
    } else {
      console.log('📊 User Property Set:', property, value)
    }
  }
}

export default weddingAnalytics