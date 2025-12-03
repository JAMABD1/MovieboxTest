import { NextRequest, NextResponse } from "next/server";
import { fetchNowPlayingMovies } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || "1");

  try {
    const data = await fetchNowPlayingMovies(page);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch now playing movies" },
      { status: 500 }
    );
  }
}


