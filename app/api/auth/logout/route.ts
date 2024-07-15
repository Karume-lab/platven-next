import { getExpiredCookieHeader } from "@/lib/auth-utils";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const response = NextResponse.json(
    { detail: "Logged out succesffully!" },
    { headers: getExpiredCookieHeader(request) },
  );
  return response;
};
