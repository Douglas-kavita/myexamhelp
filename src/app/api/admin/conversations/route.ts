import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const password = url.searchParams.get("password") ?? "";

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("conversations")
      .select("id, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error("GET /api/admin/conversations error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
