import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/api/auth/[...nextauth]/route";
import { addToWatchlist, getWatchlistMovies, getWatchlistTV } from "@/lib/tmdb";

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
        ? await getWatchlistTV(sessionId, page)
        : await getWatchlistMovies(sessionId, page);

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch watchlist" },
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
    const data = await addToWatchlist(sessionId, body);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to update watchlist" },
      { status: 500 }
    );
  }
}


