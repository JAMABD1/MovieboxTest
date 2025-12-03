import { NextResponse } from "next/server";
import { auth } from "@/api/auth/[...nextauth]/route";
import { getAccountDetails } from "@/lib/tmdb";

const getSessionId = () => {
  const sessionId = process.env.TMDB_SESSION_ID;
  if (!sessionId) {
    throw new Error("TMDB_SESSION_ID environment variable is not set");
  }
  return sessionId;
};

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const sessionId = getSessionId();
    const data = await getAccountDetails(sessionId);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch account details" },
      { status: 500 }
    );
  }
}


