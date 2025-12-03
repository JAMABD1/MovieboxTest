import { NextRequest, NextResponse } from "next/server";
import { fetchTopRatedTV } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || "1");

  try {
    const data = await fetchTopRatedTV(page);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch top rated TV shows" },
      { status: 500 }
    );
  }
}


