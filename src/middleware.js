import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Check if the session cookie exists
  const sessionCookie = request.cookies.get("appwrite-session");

  // 2. Define routes that logged-in users should NOT see
  const authRoutes = ["/signin", "/signup", "/forgot-password"];

  // 3. Redirect logic
  // If user is logged in (cookie exists) AND is on an auth page -> Redirect to Home
  if (sessionCookie && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Otherwise, continue as normal
  return NextResponse.next();
}

export const config = {
  // Apply this middleware to all routes except static assets (images, fonts, etc.)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
