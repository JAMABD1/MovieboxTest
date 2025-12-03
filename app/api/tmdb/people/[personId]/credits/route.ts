import { NextRequest, NextResponse } from "next/server";
import { fetchPersonCombinedCredits } from "@/lib/tmdb";

interface RouteParams {
  params: Promise<{
    personId: string;
  }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { personId } = await params;
  const id = Number(personId);
  if (!id || Number.isNaN(id)) {
    return NextResponse.json(
      { error: "Invalid person id" },
      { status: 400 }
    );
  }

  try {
    const data = await fetchPersonCombinedCredits(id);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch person credits" },
      { status: 500 }
    );
  }
}


