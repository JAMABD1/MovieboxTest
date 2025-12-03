import { NextResponse } from "next/server";
import { fetchTVGenres } from "@/lib/tmdb";

export async function GET() {
  try {
    const data = await fetchTVGenres();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch TV genres" },
      { status: 500 }
    );
  }
}


