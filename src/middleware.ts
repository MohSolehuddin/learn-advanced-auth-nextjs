import authConfig from "@/auth.config";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from "@/routes";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isLoginAndOTPVerified = isLoggedIn && req?.auth?.user.OTP_verified;

  const isApiAuthPrefix = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthPrefix) return NextResponse.next();

  if (isAuthRoute) {
    if (isLoginAndOTPVerified) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    if (isLoggedIn && nextUrl.pathname !== "/auth/2fa") {
      return NextResponse.redirect(new URL("/auth/2fa", nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoginAndOTPVerified && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)"],
};
