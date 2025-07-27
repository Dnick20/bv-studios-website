import { NextResponse } from 'next/server'

export default function middleware(req) {
  const { pathname } = req.nextUrl

  // Add basic security headers
  const response = NextResponse.next()
  
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')

  // Log for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Simple Middleware] ${req.method} ${pathname}`)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
} 