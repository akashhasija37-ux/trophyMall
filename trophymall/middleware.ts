import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {

  const authCookie = request.cookies.get("auth")?.value
  const isLoggedIn = authCookie === "true"

  console.log("AUTH COOKIE:", request.cookies.get("auth"))

  const { pathname } = request.nextUrl

  // Protect dashboard
  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Prevent going back to login
  if (pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}