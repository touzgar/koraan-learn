import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const publicRoutes = ['/', '/sign-in', '/api/auth/login', '/api/auth/logout']

  const isPublic = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))

  if (isPublic) {
    return NextResponse.next()
  }

  const session = request.cookies.get('session')

  if (!session) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
}
