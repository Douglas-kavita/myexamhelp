import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));

    const password = (body?.password as string | undefined)?.trim();
    const chatId = (body?.chatId as string | undefined)?.trim();
    const typing = !!body?.typing;

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!chatId) {
      return NextResponse.json({ error: "chatId required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("chats")
      .update({
        operator_typing: typing,
        operator_typing_updated_at: new Date().toISOString(),
      })
      .eq("id", chatId);

    if (error) {
      console.error("Typing POST failed:", error);
      return NextResponse.json({ error: "Failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Typing POST crashed:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
