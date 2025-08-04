// PostHog Analytics for BV Studios Website - Complete Integration
import posthog from 'posthog-js'

// Initialize PostHog (client-side only) with full configuration
if (typeof window !== 'undefined') {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  
  // Initialize PostHog with real API key
  if (posthogKey && posthogKey !== 'phc_demo_key_replace_with_real_key' && !posthogKey.includes('demo') && posthogKey.length > 20) {
    try {
      posthog.init(posthogKey, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
        // Enhanced tracking features
        session_recording: { 
          enabled: true, 
          recordCrossOriginIframes: false,
          maskAllInputs: false,
          maskInputOptions: {
            password: true,
            email: false
          }
        },
        capture_pageview: true,
        capture_performance: true,
        autocapture: true,
        capture_heatmaps: true,
        // Enhanced user identification
        person_profiles: 'identified_only',
        // Debug mode for development
        debug: process.env.NODE_ENV === 'development',
        // Enhanced event batching
        batch_size: 10,
        request_batching: true,
        // Cross-domain tracking
        cross_subdomain_cookie: false,
        persistence: 'localStorage+cookie'
      })
      
      // Enhanced user identification
      if (typeof localStorage !== 'undefined') {
        const userEmail = localStorage.getItem('userEmail')
        const adminUser = localStorage.getItem('adminUser')
        
        if (userEmail) {
          posthog.identify(userEmail, { user_type: 'customer' })
        } else if (adminUser) {
          const admin = JSON.parse(adminUser)
          posthog.identify(admin.email || admin.username, { 
            user_type: 'admin',
            admin_role: admin.role || 'admin'
          })
        }
      }
      
      console.log('✅ PostHog Analytics: Fully initialized and tracking!')
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

// Comprehensive website analytics events
export const analytics = {
  // Page Analytics
  pageView: (pageName, additionalData = {}) => {
    safeCapture('Page View', {
      page_name: pageName,
      page_url: typeof window !== 'undefined' ? window.location.href : '',
      page_path: typeof window !== 'undefined' ? window.location.pathname : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      viewport_width: typeof window !== 'undefined' ? window.innerWidth : 0,
      viewport_height: typeof window !== 'undefined' ? window.innerHeight : 0,
      ...additionalData
    })
  },

  // User Authentication Events
  userSignedIn: (userType, userId) => {
    safeCapture('User Signed In', {
      user_type: userType,
      user_id: userId,
      sign_in_time: new Date().toISOString()
    })
  },

  userSignedOut: (userType, userId) => {
    safeCapture('User Signed Out', {
      user_type: userType,
      user_id: userId,
      sign_out_time: new Date().toISOString()
    })
  },

  // Navigation Events
  navigationClick: (linkText, destination) => {
    safeCapture('Navigation Click', {
      link_text: linkText,
      destination: destination,
      source_page: typeof window !== 'undefined' ? window.location.pathname : ''
    })
  },

  // Contact Form Events
  contactFormStarted: () => {
    safeCapture('Contact Form Started', {
      form_type: 'contact',
      start_time: new Date().toISOString()
    })
  },

  contactFormSubmitted: (formData) => {
    safeCapture('Contact Form Submitted', {
      form_type: 'contact',
      has_name: !!formData.name,
      has_email: !!formData.email,
      has_message: !!formData.message,
      message_length: formData.message?.length || 0,
      submit_time: new Date().toISOString()
    })
  },

  // Portfolio Events
  portfolioItemViewed: (itemType, itemName) => {
    safeCapture('Portfolio Item Viewed', {
      item_type: itemType,
      item_name: itemName,
      view_time: new Date().toISOString()
    })
  },

  // Business Analytics
  serviceInterestShown: (serviceName, action) => {
    safeCapture('Service Interest', {
      service_name: serviceName,
      action: action, // 'viewed', 'clicked', 'inquired'
      page_source: typeof window !== 'undefined' ? window.location.pathname : ''
    })
  },

  // Admin Dashboard Events
  adminActionPerformed: (action, details = {}) => {
    safeCapture('Admin Action', {
      action: action,
      timestamp: new Date().toISOString(),
      ...details
    })
  },

  // Error Tracking
  errorOccurred: (errorType, errorMessage, context = {}) => {
    safeCapture('Error Occurred', {
      error_type: errorType,
      error_message: errorMessage,
      page_url: typeof window !== 'undefined' ? window.location.href : '',
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      timestamp: new Date().toISOString(),
      ...context
    })
  },

  // Performance Metrics
  performanceMetric: (metric, value, context = {}) => {
    safeCapture('Performance Metric', {
      metric_name: metric,
      metric_value: value,
      page_url: typeof window !== 'undefined' ? window.location.href : '',
      timestamp: new Date().toISOString(),
      ...context
    })
  },

  // Business Conversion Events
  leadGenerated: (source, leadType, details = {}) => {
    safeCapture('Lead Generated', {
      lead_source: source,
      lead_type: leadType,
      conversion_time: new Date().toISOString(),
      ...details
    })
  },

  // Wedding-specific analytics events
  wedding: {
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
}

// Keep legacy export for backward compatibility
export const weddingAnalytics = analytics.wedding

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

export default analytics