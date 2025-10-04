import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PASSWORD = process.env.ADMIN_PASSWORD;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const password = req.cookies.get("password")?.value;

    if (password !== PASSWORD) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
