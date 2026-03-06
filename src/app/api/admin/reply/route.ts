import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));

    const password = (body?.password as string | undefined)?.trim();
    const chatId = (body?.chatId as string | undefined)?.trim();
    const message = (body?.message as string | undefined)?.trim();

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!chatId || !message) {
      return NextResponse.json(
        { error: "chatId and message required" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from("messages").insert({
      chat_id: chatId,
      sender: "operator", // ✅ matches DB constraint
      body: message,
    });

    if (error) {
      console.error("Supabase operator insert failed:", error);
      return NextResponse.json({ error: "Failed to send" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Admin reply crashed:", e);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
