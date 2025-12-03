import { NextRequest, NextResponse } from "next/server";
import { fetchWatchProvidersForMovie } from "@/lib/tmdb";

interface RouteParams {
  params: Promise<{
    movieId: string;
  }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { movieId } = await params;
  const id = Number(movieId);
  if (!id || Number.isNaN(id)) {
    return NextResponse.json(
      { error: "Invalid movie id" },
      { status: 400 }
    );
  }

  try {
    const data = await fetchWatchProvidersForMovie(id);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch movie watch providers" },
      { status: 500 }
    );
  }
}


