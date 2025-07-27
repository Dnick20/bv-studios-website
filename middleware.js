import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/dashboard/project',
  '/api/files',
  '/api/auth/register'
]

// Define admin routes that require admin privileges
const adminRoutes = [
  '/admin',
  '/api/admin'
]

// Define public routes that don't need authentication
const publicRoutes = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/api/auth/signin',
  '/api/auth/signout',
  '/api/auth/callback'
]

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token
    const isAuthenticated = !!token
    const userRole = token?.role || 'user'

    // Add security headers to all responses
    const response = NextResponse.next()
    
    // Security Headers
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    
    // Content Security Policy
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "media-src 'self' https:",
      "connect-src 'self' https://api.github.com https://accounts.google.com https://www.googleapis.com",
      "frame-src 'self' https://www.youtube.com https://www.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ')
    
    response.headers.set('Content-Security-Policy', csp)

    // Handle authentication for protected routes
    if (isProtectedRoute(pathname)) {
      if (!isAuthenticated) {
        // Redirect to sign-in page for unauthenticated users
        const signInUrl = new URL('/auth/signin', req.url)
        signInUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(signInUrl)
      }

      // Check admin privileges for admin routes
      if (isAdminRoute(pathname) && userRole !== 'admin') {
        // Redirect to dashboard for non-admin users trying to access admin routes
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    // Handle authenticated users trying to access auth pages
    if (isAuthenticated && isAuthRoute(pathname)) {
      // Redirect authenticated users away from auth pages
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Rate limiting for API routes
    if (pathname.startsWith('/api/')) {
      return handleRateLimiting(req, response)
    }

    // Logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Middleware] ${req.method} ${pathname} - Auth: ${isAuthenticated}, Role: ${userRole}`)
    }

    return response
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Allow all requests to public routes
        if (isPublicRoute(pathname)) {
          return true
        }

        // Require authentication for protected routes
        if (isProtectedRoute(pathname)) {
          return !!token
        }

        // Allow all other requests
        return true
      },
    },
  }
)

// Helper functions
function isProtectedRoute(pathname) {
  return protectedRoutes.some(route => 
    pathname.startsWith(route) || pathname === route
  )
}

function isAdminRoute(pathname) {
  return adminRoutes.some(route => 
    pathname.startsWith(route) || pathname === route
  )
}

function isPublicRoute(pathname) {
  return publicRoutes.some(route => 
    pathname.startsWith(route) || pathname === route
  )
}

function isAuthRoute(pathname) {
  return pathname.startsWith('/auth/') || pathname === '/auth'
}

// Simple rate limiting implementation
function handleRateLimiting(req, response) {
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
  const userAgent = req.headers.get('user-agent') || 'unknown'
  const key = `${ip}-${userAgent}`

  // In a production environment, you'd want to use Redis or a similar store
  // This is a simplified in-memory implementation
  if (!global.rateLimitStore) {
    global.rateLimitStore = new Map()
  }

  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxRequests = 100 // 100 requests per window

  const userRequests = global.rateLimitStore.get(key) || []
  const validRequests = userRequests.filter(time => now - time < windowMs)

  if (validRequests.length >= maxRequests) {
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests' }),
      { 
        status: 429, 
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }

  validRequests.push(now)
  global.rateLimitStore.set(key, validRequests)

  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', maxRequests.toString())
  response.headers.set('X-RateLimit-Remaining', (maxRequests - validRequests.length).toString())
  response.headers.set('X-RateLimit-Reset', new Date(now + windowMs).toISOString())

  return response
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
} 