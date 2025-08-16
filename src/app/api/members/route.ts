/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/members/route.ts
import { NextResponse } from "next/server";
import { getMembers, createMember } from "@/lib/server/api";

export async function GET() {
  try {
    const members = await getMembers();
    return NextResponse.json(members);
  } catch (e) {
    console.error("GET /api/members error:", e);
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const created = await createMember(body);
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/members error:", e);
    return NextResponse.json({ error: e.message ?? "Failed to create member" }, { status: 400 });
  }
}
