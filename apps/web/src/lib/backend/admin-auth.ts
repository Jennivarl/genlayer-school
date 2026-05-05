import { NextRequest, NextResponse } from "next/server";

function getBearerToken(request: NextRequest): string | null {
  const header = request.headers.get("authorization");
  if (header?.toLowerCase().startsWith("bearer ")) {
    return header.slice("bearer ".length).trim();
  }
  return null;
}

export function requireAdminAuth(request: NextRequest): NextResponse | null {
  const expectedToken = process.env.ADMIN_ACCESS_TOKEN?.trim();

  if (!expectedToken) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "ADMIN_ACCESS_TOKEN is required in production." }, { status: 500 });
    }
    return null;
  }

  const providedToken = request.headers.get("x-admin-token")?.trim() ?? getBearerToken(request);
  if (providedToken !== expectedToken) {
    return NextResponse.json({ error: "Admin token is invalid or missing." }, { status: 401 });
  }

  return null;
}
