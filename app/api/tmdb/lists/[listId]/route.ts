import { NextRequest, NextResponse } from "next/server";
import { fetchList } from "@/lib/tmdb";

interface RouteParams {
  params: Promise<{
    listId: string;
  }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { listId } = await params;
  const id = Number(listId);
  if (!id || Number.isNaN(id)) {
    return NextResponse.json(
      { error: "Invalid list id" },
      { status: 400 }
    );
  }

  try {
    const data = await fetchList(id);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch list" },
      { status: 500 }
    );
  }
}


