import { NextRequest, NextResponse } from "next/server";
import { fetchCompanyDetails } from "@/lib/tmdb";

interface RouteParams {
  params: Promise<{
    companyId: string;
  }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { companyId } = await params;
  const id = Number(companyId);
  if (!id || Number.isNaN(id)) {
    return NextResponse.json(
      { error: "Invalid company id" },
      { status: 400 }
    );
  }

  try {
    const data = await fetchCompanyDetails(id);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch company details" },
      { status: 500 }
    );
  }
}


