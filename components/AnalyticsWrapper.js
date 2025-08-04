'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { weddingAnalytics, analyticsHelpers } from '../lib/analytics'

export default function AnalyticsWrapper({ pageName, additionalData = {} }) {
  const { data: session } = useSession()

  useEffect(() => {
    // Track page view
    weddingAnalytics.pageView(pageName, {
      has_session: !!session,
      user_email: session?.user?.email,
      ...additionalData
    })

    // Identify user if logged in
    if (session?.user?.email) {
      analyticsHelpers.identifyUser(session.user.email, {
        name: session.user.name,
        last_page_view: new Date().toISOString(),
        current_page: pageName
      })
    }

    // Track initial landing
    if (pageName === 'Home') {
      weddingAnalytics.userEngagement('site_visit', {
        is_return_visitor: !!localStorage.getItem('visited_before'),
        referrer: document.referrer,
        landing_page: pageName
      })
      
      // Mark as visited
      localStorage.setItem('visited_before', 'true')
    }
  }, [session, pageName, additionalData])

  return null // This component doesn't render anything
}