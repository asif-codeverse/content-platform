import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(
  request: NextRequest
) {

  const isDashboardRoute =
    request.nextUrl.pathname.startsWith(
      "/dashboard"
    );

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
  ],
};