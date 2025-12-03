import { NextRequest, NextResponse } from "next/server";
import { fetchMovieDetails, fetchMovieVideos } from "@/lib/tmdb";

interface RouteParams {
  params: Promise<{
    movieId: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { movieId } = await params;
  const id = Number(movieId);
  if (!id || Number.isNaN(id)) {
    return NextResponse.json(
      { error: "Invalid movie id" },
      { status: 400 }
    );
  }

  const { searchParams } = new URL(req.url);
  const includeVideos = searchParams.get("include")?.includes("videos");

  try {
    const details = await fetchMovieDetails(id);

    if (!includeVideos) {
      return NextResponse.json({ details });
    }

    const videos = await fetchMovieVideos(id);
    return NextResponse.json({ details, videos });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch movie details" },
      { status: 500 }
    );
  }
}


