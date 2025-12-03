import { NextRequest, NextResponse } from "next/server";
import { fetchTrending } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const timeWindow = (searchParams.get("time_window") as "day" | "week") || "week";

  try {
    const data = await fetchTrending(timeWindow);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch trending content" },
      { status: 500 }
    );
  }
}


