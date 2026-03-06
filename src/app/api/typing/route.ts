import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const chatId = url.searchParams.get("chatId") || "";

  if (!chatId) return NextResponse.json({ operatorTyping: false });

  const { data, error } = await supabaseAdmin
    .from("typing")
    .select("operator_typing")
    .eq("conversation_id", chatId)
    .maybeSingle(); // ✅ key fix (no crash if 0 rows)

  if (error) {
    console.log("Typing GET failed:", error);
    return NextResponse.json({ operatorTyping: false });
  }

  return NextResponse.json({ operatorTyping: !!data?.operator_typing });
}
