import { NextResponse } from "next/server";

export const runtime = "nodejs";

// ---------------------------
// Deadline-mode in-memory store
// ---------------------------
// NOTE: resets when you restart dev server
type DbMsg = {
  id: string;
  sender: "visitor" | "operator";
  body: string;
  created_at: string;
};

type ChatStore = Record<string, DbMsg[]>;

// Put it on globalThis so it survives hot reloads (usually)
declare global {
  // eslint-disable-next-line no-var
  var __MEHEX_CHAT_STORE__: ChatStore | undefined;
}

const store: ChatStore = (globalThis.__MEHEX_CHAT_STORE__ ??= {});

// Optional: quick sanity check in browser
export async function GET() {
  return NextResponse.json({
    ok: true,
    info: "Use POST /api/messages",
    chatsInMemory: Object.keys(store).length,
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({} as any));

  const text = String(body?.text ?? "").trim();
  let visitorId = String(body?.visitorId ?? "").trim();
  const chatIdRaw = body?.chatId ? String(body.chatId) : "";

  if (!text) {
    return NextResponse.json({ error: "Missing text" }, { status: 400 });
  }

  if (!visitorId) {
    visitorId = crypto.randomUUID();
  }

  const chatId = chatIdRaw || crypto.randomUUID();

  // Ensure chat exists
  if (!store[chatId]) store[chatId] = [];

  // Save visitor message
  const msg: DbMsg = {
    id: crypto.randomUUID(),
    sender: "visitor",
    body: text,
    created_at: new Date().toISOString(),
  };

  store[chatId].push(msg);

  return NextResponse.json({
    ok: true,
    chatId,
    visitorId,
  });
}
