import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/social");

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/signUp", request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/social/:path*"],
};