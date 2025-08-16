/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/members/[id]/route.ts
import { NextResponse } from "next/server";
import { getMemberById, updateMember, deleteMember } from "@/./lib/server/api";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const member = await getMemberById(id);
    if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });
    return NextResponse.json(member);
  } catch (e) {
    console.error("GET /api/members/[id] error:", e);
    return NextResponse.json({ error: "Failed to fetch member" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await req.json();
    const updated = await updateMember(id, body);
    return NextResponse.json(updated);
  } catch (e: any) {
    console.error("PUT /api/members/[id] error:", e);
    return NextResponse.json({ error: e.message ?? "Failed to update member" }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    await deleteMember(id);
    return NextResponse.json({ message: "Member deleted" });
  } catch (e) {
    console.error("DELETE /api/members/[id] error:", e);
    return NextResponse.json({ error: "Failed to delete member" }, { status: 500 });
  }
}
