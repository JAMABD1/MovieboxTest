import { NextRequest, NextResponse } from "next/server";
import { fetchTVDetails, fetchTVVideos } from "@/lib/tmdb";

interface RouteParams {
  params: Promise<{
    tvId: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { tvId } = await params;
  const id = Number(tvId);
  if (!id || Number.isNaN(id)) {
    return NextResponse.json(
      { error: "Invalid TV id" },
      { status: 400 }
    );
  }

  const { searchParams } = new URL(req.url);
  const includeVideos = searchParams.get("include")?.includes("videos");

  try {
    const details = await fetchTVDetails(id);

    if (!includeVideos) {
      return NextResponse.json({ details });
    }

    const videos = await fetchTVVideos(id);
    return NextResponse.json({ details, videos });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch TV details" },
      { status: 500 }
    );
  }
}


