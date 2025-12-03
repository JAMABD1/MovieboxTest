import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/api/auth/[...nextauth]/route";
import { getFavoriteMovies, getFavoriteTV, markAsFavorite } from "@/lib/tmdb";

const getSessionId = () => {
  const sessionId = process.env.TMDB_SESSION_ID;
  if (!sessionId) {
    throw new Error("TMDB_SESSION_ID environment variable is not set");
  }
  return sessionId;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mediaType = (searchParams.get("media_type") || "movie") as "movie" | "tv";
  const page = Number(searchParams.get("page") || "1");

  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const sessionId = getSessionId();
    const data =
      mediaType === "tv"
        ? await getFavoriteTV(sessionId, page)
        : await getFavoriteMovies(sessionId, page);

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

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
    const data = await markAsFavorite(sessionId, body);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to update favorites" },
      { status: 500 }
    );
  }
}


