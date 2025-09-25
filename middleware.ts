// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = ['/auth/login', '/auth/signup'].includes(path)
  const token = request.cookies.get('token')?.value || ''

  // Redirect protected routes if not authenticated
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.nextUrl))
  }

  // Redirect authenticated users away from auth pages
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/clips/:path*',
    '/auth/login',
    '/auth/signup'
  ]
}