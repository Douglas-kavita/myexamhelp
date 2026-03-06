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

  if (!chatId) return NextResponse.json({ messages: [] });

  return NextResponse.json({ messages: store[chatId] ?? [] });
}
