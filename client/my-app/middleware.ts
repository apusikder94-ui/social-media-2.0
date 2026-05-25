import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  console.log("COOKIES:", request.cookies.getAll());
  const { pathname } = request.nextUrl;

  const isProtected = pathname.startsWith("/social");
  const isAuth = pathname.startsWith("/auth");

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/auth/signUp", request.url));
  }

  if (isAuth && token) {
    return NextResponse.redirect(new URL("/social", request.url));
  }

  return NextResponse.next();
}