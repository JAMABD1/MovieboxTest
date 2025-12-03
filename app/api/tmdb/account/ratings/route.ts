import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/api/auth/[...nextauth]/route";
import { rateMedia } from "@/lib/tmdb";

const getSessionId = () => {
  const sessionId = process.env.TMDB_SESSION_ID;
  if (!sessionId) {
    throw new Error("TMDB_SESSION_ID environment variable is not set");
  }
  return sessionId;
};

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const sessionId = getSessionId();
    const body = await req.json();
    const { mediaType, id, rating } = body as {
      mediaType: "movie" | "tv";
      id: number;
      rating: number;
    };

    if (!mediaType || !id || typeof rating !== "number") {
      return NextResponse.json(
        { error: "mediaType, id and rating are required" },
        { status: 400 }
      );
    }

    const data = await rateMedia(sessionId, mediaType, id, rating);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to rate media" },
      { status: 500 }
    );
  }
}


