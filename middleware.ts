import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes protection
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const sessionToken = request.cookies.get("next-auth.session-token") || 
                         request.cookies.get("__Secure-next-auth.session-token") ||
                         request.cookies.get("authjs.session-token") ||
                         request.cookies.get("__Secure-authjs.session-token");

    if (!sessionToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
