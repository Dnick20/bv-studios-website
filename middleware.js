import { NextResponse } from 'next/server'

export async function middleware(request) {
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isAdminLoginPage = request.nextUrl.pathname === '/admin'

  // Use presence of admin token cookie as a simple check (optional)
  const hasAdminToken = Boolean(request.cookies.get('adminToken')?.value)

  if (isAdminRoute && !isAdminLoginPage && !hasAdminToken) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  if (isAdminLoginPage && hasAdminToken) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/admin'],
}
