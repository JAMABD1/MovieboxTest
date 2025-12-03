import { NextRequest, NextResponse } from "next/server";
import { fetchNetworkDetails } from "@/lib/tmdb";

interface RouteParams {
  params: Promise<{
    networkId: string;
  }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { networkId } = await params;
  const id = Number(networkId);
  if (!id || Number.isNaN(id)) {
    return NextResponse.json(
      { error: "Invalid network id" },
      { status: 400 }
    );
  }

  try {
    const data = await fetchNetworkDetails(id);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch network details" },
      { status: 500 }
    );
  }
}


