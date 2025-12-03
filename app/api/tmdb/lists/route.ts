import { NextRequest, NextResponse } from "next/server";
import { addToList, createList, removeFromList } from "@/lib/tmdb";

const getSessionId = () => {
  const sessionId = process.env.TMDB_SESSION_ID;
  if (!sessionId) {
    throw new Error("TMDB_SESSION_ID environment variable is not set");
  }
  return sessionId;
};

export async function POST(req: NextRequest) {
  try {
    const sessionId = getSessionId();
    const body = await req.json();

    const data = await createList(sessionId, body);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create list" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const sessionId = getSessionId();
    const body = await req.json();
    const { listId, mediaId } = body as { listId: number; mediaId: number };

    if (!listId || !mediaId) {
      return NextResponse.json(
        { error: "listId and mediaId are required" },
        { status: 400 }
      );
    }

    const data = await addToList(sessionId, listId, mediaId);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to add to list" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const sessionId = getSessionId();
    const body = await req.json();
    const { listId, mediaId } = body as { listId: number; mediaId: number };

    if (!listId || !mediaId) {
      return NextResponse.json(
        { error: "listId and mediaId are required" },
        { status: 400 }
      );
    }

    const data = await removeFromList(sessionId, listId, mediaId);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to remove from list" },
      { status: 500 }
    );
  }
}


