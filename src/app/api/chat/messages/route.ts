import { NextResponse } from "next/server";

export const runtime = "nodejs";

type DbMsg = {
  id: string;
  sender: "visitor" | "operator";
  body: string;
  created_at: string;
};

type ChatStore = Record<string, DbMsg[]>;

declare global {
  // eslint-disable-next-line no-var
  var __MEHEX_CHAT_STORE__: ChatStore | undefined;
}

const store: ChatStore = (globalThis.__MEHEX_CHAT_STORE__ ??= {});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const chatId = url.searchParams.get("chatId") || "";

  if (!chatId) {
    return NextResponse.json({ messages: [] });
  }

  return NextResponse.json({
    messages: store[chatId] ?? [],
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({} as any));

  const chatId = String(body.chatId ?? "").trim();
  const text = String(body.text ?? "").trim();

  // ✅ Only require text
  if (!text) {
    return NextResponse.json(
      { ok: false, error: "Missing text" },
      { status: 400 }
    );
  }

  // ✅ Create chatId if first message
  let finalChatId = chatId;

  if (!finalChatId) {
    finalChatId = crypto.randomUUID();
  }

  const msg: DbMsg = {
    id: crypto.randomUUID(),
    sender: "visitor",
    body: text,
    created_at: new Date().toISOString(),
  };

  if (!store[finalChatId]) {
    store[finalChatId] = [];
  }

  store[finalChatId].push(msg);

  return NextResponse.json({
    ok: true,
    message: msg,
    chatId: finalChatId, // ✅ Important
  });
}

