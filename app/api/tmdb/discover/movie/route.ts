import { NextRequest, NextResponse } from "next/server";
import { discoverMovies } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const options: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    options[key] = value;
  });

  try {
    const data = await discoverMovies(options);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to discover movies" },
      { status: 500 }
    );
  }
}


