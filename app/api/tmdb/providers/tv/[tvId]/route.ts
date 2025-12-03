import { NextRequest, NextResponse } from "next/server";
import { fetchWatchProvidersForTV } from "@/lib/tmdb";

interface RouteParams {
  params: Promise<{
    tvId: string;
  }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { tvId } = await params;
  const id = Number(tvId);
  if (!id || Number.isNaN(id)) {
    return NextResponse.json(
      { error: "Invalid TV id" },
      { status: 400 }
    );
  }

  try {
    const data = await fetchWatchProvidersForTV(id);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch TV watch providers" },
      { status: 500 }
    );
  }
}


