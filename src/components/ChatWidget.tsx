"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseBrowser";

type Msg = {
  id: string;
  created_at: string;
  sender: "visitor" | "admin";
  body: string;
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"ask_subject" | "chat">("ask_subject");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const openedOnceRef = useRef(false);
  const [adminIsTyping, setAdminIsTyping] = useState(false);

  // ✅ POP SOUND (fixed + stable, no runtime overlay)
  const popRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const a = new Audio("/sounds/pop.mp3");
    a.preload = "auto";
    a.volume = 0.6;
    popRef.current = a;

    return () => {
      try {
        a.pause();
      } catch {}
      popRef.current = null;
    };
  }, []);

  const playPop = useCallback(() => {
    const a = popRef.current;
    if (!a) return;

    try {
      a.currentTime = 0;
      void a.play().catch(() => {
        // autoplay blocked — ignore
      });
    } catch {
      // ignore
    }
  }, []);

  // ✅ STEP 1: global open/close events (so any button can open chat)
  // (kept your original events + added myexamhelp:open-chat)
  useEffect(() => {
    const openHandler = () => {
      console.log("✅ open-chat RECEIVED");
      setOpen(true);
      playPop();
    };
    const closeHandler = () => {
      console.log("✅ close-chat RECEIVED");
      setOpen(false);
    };

    const openHandlerNew = () => {
      console.log("✅ myexamhelp:open-chat RECEIVED");
      setOpen(true);
      playPop();
    };

    window.addEventListener("open-chat", openHandler);
    window.addEventListener("close-chat", closeHandler);
    window.addEventListener("myexamhelp:open-chat", openHandlerNew);

    return () => {
      window.removeEventListener("open-chat", openHandler);
      window.removeEventListener("close-chat", closeHandler);
      window.removeEventListener("myexamhelp:open-chat", openHandlerNew);
    };
  }, [playPop]);

  // 1️⃣ Create or reuse conversation (NO AUTH)
  useEffect(() => {
    (async () => {
      const existing = localStorage.getItem("meh_conversation_id");
      if (existing) {
        setConversationId(existing);
        return;
      }

      const visitorId =
        localStorage.getItem("meh_visitor_id") || crypto.randomUUID();

      localStorage.setItem("meh_visitor_id", visitorId);

      const { data, error } = await supabase
        .from("conversations")
        .insert({
          user_id: visitorId,
          subject: null,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Conversation creation failed:", error);
        return;
      }

      if (data?.id) {
        localStorage.setItem("meh_conversation_id", data.id);
        setConversationId(data.id);
      }
    })();
  }, []);

  // 2️⃣ Load messages + realtime
  useEffect(() => {
    if (!conversationId) return;

    (async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      setMessages((data as Msg[]) ?? []);
    })();

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as Msg;

          setMessages((prev) => [...prev, newMsg]);

          // 🔔 POP only when admin sends to client
          if (newMsg.sender === "admin") {
            playPop();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, playPop]);

  // 2b️⃣ Typing indicator (admin -> client)
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`typing:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "typing",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const row = payload.new as any;
          setAdminIsTyping(!!row?.admin_typing);
        }
      )
      .subscribe();

    // fetch current typing state once
    (async () => {
      const { data } = await supabase
        .from("typing")
        .select("admin_typing")
        .eq("conversation_id", conversationId)
        .maybeSingle();
      setAdminIsTyping(!!data?.admin_typing);
    })();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  // 3️⃣ Auto open after 30 seconds
  useEffect(() => {
    const t = window.setTimeout(() => {
      if (openedOnceRef.current) return;
      openedOnceRef.current = true;
      setOpen(true);
      playPop();
    }, 30000);

    return () => window.clearTimeout(t);
  }, [playPop]);

  async function sendVisitorMessage(body: string) {
    if (!conversationId || !body.trim()) return;

    const trimmed = body.trim();

    // Optimistic UI update (instant message display)
    const tempMessage: Msg = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      sender: "visitor",
      body: trimmed,
    };

    setMessages((prev) => [...prev, tempMessage]);

    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender: "visitor",
      body: trimmed,
    });

    if (error) {
      console.error("Message insert failed:", error);
    }
  }

  async function submitChat() {
    await sendVisitorMessage(text);
    setText("");
  }

  return (
    <>
      {/* Floating Button */}
      <button
        type="button"
        aria-label="Open chat"
        onClick={() => {
          setOpen(true);
          playPop();
        }}
        className="fixed bottom-6 right-6 z-[9999] h-14 w-14 rounded-full bg-slate-900 shadow-2xl flex items-center justify-center hover:scale-[1.03] active:scale-[0.98] transition-transform"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 12c0 4.418-4.03 8-9 8-1.09 0-2.135-.153-3.11-.44L3 21l1.61-4.03A7.44 7.44 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z"
            stroke="white"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M7.5 12h.01M11.5 12h.01M15.5 12h.01"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-[9999] w-[360px] overflow-hidden rounded-2xl border bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-900 to-slate-700 text-white">
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-9 rounded-full bg-white/15 flex items-center justify-center">
                <span className="text-sm font-semibold">ME</span>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-slate-800" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold">MyExamHelp Chat</div>
                <div className="text-xs text-white/75">Online • replies fast</div>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center"
              type="button"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="h-[340px] bg-slate-50 overflow-y-auto px-4 py-4 space-y-3">
            <div className="max-w-[85%] rounded-2xl bg-white border px-3 py-2 text-sm text-slate-800 shadow-sm">
              Hi there 👋 <br />
              What exam or subject would you like help on?
              <div className="mt-1 text-[11px] text-slate-400">
                Just type it below.
              </div>
            </div>

            {/* ✅ Typing indicator (client sees admin typing) */}
            {adminIsTyping && (
              <div className="max-w-[60%] rounded-2xl bg-white border px-3 py-2 text-sm text-slate-500 shadow-sm">
                Admin is typing…
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.sender === "visitor" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                    m.sender === "visitor"
                      ? "bg-slate-900 text-white rounded-br-md"
                      : "bg-white border text-slate-800 rounded-bl-md"
                  }`}
                >
                  {m.body}
                  <div
                    className={`mt-1 text-[10px] ${
                      m.sender === "visitor"
                        ? "text-white/60"
                        : "text-slate-400"
                    }`}
                  >
                    {new Date(m.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t bg-white px-3 py-3">
            <div className="flex items-center gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your message..."
                className="flex-1 rounded-full border px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitChat();
                }}
              />
              <button
                onClick={submitChat}
                className="rounded-full bg-slate-900 text-white px-4 py-2 text-sm hover:bg-slate-800"
                type="button"
              >
                Send
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>Press Enter to send</span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Secure chat
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}