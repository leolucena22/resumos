import { NextResponse } from "next/server";

const PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(req: Request) {
  const { password } = await req.json();

  if (password === PASSWORD) {
    const response = NextResponse.json({ success: true });
    response.cookies.set("password", password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    return response;
  } else {
    return NextResponse.json({ success: false }, { status: 401 });
  }
}
