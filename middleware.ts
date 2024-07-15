// Protecting routes with next-auth
// https://next-auth.js.org/configuration/nextjs#middleware
// https://nextjs.org/docs/app/building-your-application/routing/middleware

import { NextRequest, NextResponse } from "next/server";
import { authCookieConfig } from "./constants";
import { decode, JwtPayload } from "jsonwebtoken";
import { serialize } from "cookie";

const redirectToAuth = (request: NextRequest) => {
  const authCookie = request.cookies.get(authCookieConfig.name)?.value;
  const callbackUrl = request.nextUrl.pathname;

  const serializedCookieToken = serialize(
    authCookieConfig.name,
    authCookie ?? "",
    {
      ...authCookieConfig.config,
      maxAge: -1,
    },
  );

  const headers = new Headers();
  headers.append("Set-Cookie", serializedCookieToken);
  return NextResponse.redirect(
    new URL(
      `/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`,
      request.url,
    ),
    { headers },
  );
};

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get(authCookieConfig.name)?.value;
  const isAuthenticated = decode(authCookie ?? "") as JwtPayload | null;
  const isProtected = request.nextUrl.pathname.startsWith("/dashboard");

  //   // TODO Specify protected routes
  if (!isAuthenticated && isProtected) {
    return redirectToAuth(request);
  }

  if (!(isAuthenticated as any).accountVerified) {
    return NextResponse.redirect(
      new URL(
        `/verify?callbackUrl=${encodeURIComponent(request.nextUrl.pathname)}`,
        request.url,
      ),
    );
  }

  const response = NextResponse.next();
  if (response.status === 401) {
    console.log(
      "----------------------------------------------------------",
      "Redirect user to auth screen",
      "----------------------------------------------------------",
    );

    return redirectToAuth(request);
  }
  return response;
}

export const config = { matcher: ["/dashboard/:path*"] };
