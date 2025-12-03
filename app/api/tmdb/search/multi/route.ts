import { NextRequest, NextResponse } from "next/server";
import { searchMulti } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";

  if (!query.trim()) {
    return NextResponse.json(
      { error: "Query parameter 'query' is required" },
      { status: 400 }
    );
  }

  try {
    const data = await searchMulti(query);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to search media" },
      { status: 500 }
    );
  }
}


