import { NextResponse, type NextRequest } from "next/server";

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

export function middleware(req: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return new NextResponse(
      "ADMIN_PASSWORD env var is not set on the server.",
      { status: 503 }
    );
  }

  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    try {
      const decoded = atob(auth.slice("Basic ".length));
      // Accept either "anything:PASSWORD" or just ":PASSWORD"
      const supplied = decoded.includes(":")
        ? decoded.slice(decoded.indexOf(":") + 1)
        : decoded;
      if (supplied === expected) return NextResponse.next();
    } catch {
      // fall through to 401
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="7Winds Admin", charset="UTF-8"',
    },
  });
}
