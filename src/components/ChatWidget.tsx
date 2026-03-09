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
  const [text, setText] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [adminIsTyping, setAdminIsTyping] = useState(false);

  const openedOnceRef = useRef(false);
  const popRef = useRef<HTMLAudioElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const initialLoadDoneRef = useRef(false);

  useEffect(() => {
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
      void a.play().catch(() => {});
    } catch {}
  }, []);

  function scrollToBottom(smooth = false) {
    requestAnimationFrame(() => {
      scrollerRef.current?.scrollTo({
        top: scrollerRef.current.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    });
  }

  useEffect(() => {
    const openHandler = () => {
      setOpen(true);
      playPop();
    };

    const closeHandler = () => setOpen(false);

    window.addEventListener("open-chat", openHandler);
    window.addEventListener("close-chat", closeHandler);
    window.addEventListener("myexamhelp:open-chat", openHandler);

    return () => {
      window.removeEventListener("open-chat", openHandler);
      window.removeEventListener("close-chat", closeHandler);
      window.removeEventListener("myexamhelp:open-chat", openHandler);
    };
  }, [playPop]);

  useEffect(() => {
    (async () => {
      let visitorId = localStorage.getItem("meh_visitor_id");

      if (!visitorId) {
        visitorId = crypto.randomUUID();
        localStorage.setItem("meh_visitor_id", visitorId);
      }

      const existingConversation = localStorage.getItem("meh_conversation_id");

      if (existingConversation) {
        setConversationId(existingConversation);
        return;
      }

      const { data: found, error: findError } = await supabase
        .from("conversations")
        .select("id")
        .eq("user_id", visitorId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (findError) {
        console.error("Conversation lookup failed:", findError);
      }

      if (found?.id) {
        localStorage.setItem("meh_conversation_id", found.id);
        setConversationId(found.id);
        return;
      }

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

  async function loadMessages(smoothScroll = false) {
    if (!conversationId) return;

    const { data, error } = await supabase
      .from("messages")
      .select("id, created_at, sender, body")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Loading messages failed:", error);
      return;
    }

    const nextMessages = (data as Msg[]) ?? [];

    const prevIds = new Set(messages.map((m) => m.id));
    const newlyArrivedAdmin = nextMessages.some(
      (m) => !prevIds.has(m.id) && m.sender === "admin"
    );

    const hasAnyChange =
      nextMessages.length !== messages.length ||
      nextMessages.some((m, i) => messages[i]?.id !== m.id);

    setMessages(nextMessages);

    if (hasAnyChange) {
      scrollToBottom(smoothScroll);
    }

    if (initialLoadDoneRef.current && newlyArrivedAdmin) {
      playPop();
    }
  }

  async function loadTypingStatus() {
    if (!conversationId) return;

    const { data } = await supabase
      .from("typing")
      .select("admin_typing")
      .eq("conversation_id", conversationId)
      .maybeSingle();

    setAdminIsTyping(!!data?.admin_typing);
  }

  useEffect(() => {
    if (!conversationId) return;

    (async () => {
      await loadMessages(false);
      await loadTypingStatus();
      initialLoadDoneRef.current = true;
    })();
  }, [conversationId]);

  // Poll messages + typing every 3 seconds
  useEffect(() => {
    if (!conversationId) return;

    const poll = async () => {
      await loadMessages(true);
      await loadTypingStatus();
    };

    const interval = setInterval(poll, 3000);

    return () => clearInterval(interval);
  }, [conversationId, messages]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (openedOnceRef.current) return;
      openedOnceRef.current = true;
      setOpen(true);
      playPop();
    }, 30000);

    return () => clearTimeout(t);
  }, [playPop]);

  useEffect(() => {
    if (!open) return;
    scrollToBottom(false);
  }, [open, messages]);

  async function sendVisitorMessage(body: string) {
    if (!conversationId || !body.trim()) return;

    const trimmed = body.trim();
    const tempId = crypto.randomUUID();

    const tempMessage: Msg = {
      id: tempId,
      created_at: new Date().toISOString(),
      sender: "visitor",
      body: trimmed,
    };

    setMessages((prev) => [...prev, tempMessage]);
    scrollToBottom(true);

    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender: "visitor",
        body: trimmed,
      })
      .select("id, created_at, sender, body")
      .single();

    if (error) {
      console.error("Message insert failed:", error);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      return;
    }

    if (data) {
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? (data as Msg) : m))
      );
      scrollToBottom(true);
    }
  }

  async function submitChat() {
    await sendVisitorMessage(text);
    setText("");
  }

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          playPop();
        }}
        className="fixed bottom-6 right-6 z-[9999] h-14 w-14 rounded-full bg-slate-900 text-white shadow-2xl"
        aria-label="Open chat"
        type="button"
      >
        💬
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-[9999] w-[360px] overflow-hidden rounded-2xl border bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-slate-900 px-4 py-3 text-white">
            <div>
              <div className="text-sm font-semibold">MyExamHelp Chat</div>
              <div className="text-xs opacity-70">Online • replies fast</div>
            </div>

            <button onClick={() => setOpen(false)} type="button" aria-label="Close chat">
              ✕
            </button>
          </div>

          <div
            ref={scrollerRef}
            className="h-[340px] space-y-3 overflow-y-auto bg-slate-50 px-4 py-4"
          >
            <div className="rounded-xl border bg-white px-3 py-2 text-sm">
              Hi there 👋 <br />
              What exam or subject would you like help on?
            </div>

            {adminIsTyping && (
              <div className="rounded-xl border bg-white px-3 py-2 text-sm text-slate-500">
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
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    m.sender === "visitor"
                      ? "bg-slate-900 text-white"
                      : "border bg-white"
                  }`}
                >
                  {m.body}

                  <div className="mt-1 text-[10px] opacity-60">
                    {new Date(m.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t bg-white px-3 py-3">
            <div className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your message..."
                className="flex-1 rounded-full border px-4 py-2 text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    submitChat();
                  }
                }}
              />

              <button
                onClick={submitChat}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white"
                type="button"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}