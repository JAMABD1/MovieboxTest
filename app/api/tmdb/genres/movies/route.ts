import { NextResponse } from "next/server";
import { fetchMovieGenres } from "@/lib/tmdb";

export async function GET() {
  try {
    const data = await fetchMovieGenres();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch movie genres" },
      { status: 500 }
    );
  }
}


