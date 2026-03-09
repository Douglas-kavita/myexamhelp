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

  // sound
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

  // open events
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

  // create / reuse visitor
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

      const { data: found } = await supabase
        .from("conversations")
        .select("id")
        .eq("user_id", visitorId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

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
        console.error(error);
        return;
      }

      if (data?.id) {
        localStorage.setItem("meh_conversation_id", data.id);
        setConversationId(data.id);
      }
    })();
  }, []);

  // load messages + realtime
  useEffect(() => {
    if (!conversationId) return;

    (async () => {
      const { data } = await supabase
        .from("messages")
        .select("id, created_at, sender, body")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      setMessages((data as Msg[]) ?? []);
    })();

  const channel = supabase
  .channel(`messages-${conversationId}`)
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

      setMessages((prev) => {
        const exists = prev.some((m) => m.id === newMsg.id);
        if (exists) return prev;
        return [...prev, newMsg];
      });

      if (newMsg.sender === "admin") playPop();
    }
  )
  .subscribe((status) => {
    console.log("Realtime status:", status);
  });

return () => {
  supabase.removeChannel(channel);
};
}, [conversationId, playPop]);

  // typing indicator
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`typing-${conversationId}`)
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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  // auto open
  useEffect(() => {
    const t = setTimeout(() => {
      if (openedOnceRef.current) return;
      openedOnceRef.current = true;
      setOpen(true);
      playPop();
    }, 30000);

    return () => clearTimeout(t);
  }, [playPop]);

  // send message
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
      console.error(error);
      return;
    }

    if (data) {
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? (data as Msg) : m))
      );
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
        onClick={() => {
          setOpen(true);
          playPop();
        }}
        className="fixed bottom-6 right-6 z-[9999] h-14 w-14 rounded-full bg-slate-900 text-white shadow-2xl"
      >
        💬
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-[9999] w-[360px] rounded-2xl border bg-white shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white">
            <div>
              <div className="text-sm font-semibold">MyExamHelp Chat</div>
              <div className="text-xs opacity-70">Online • replies fast</div>
            </div>

            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="h-[340px] overflow-y-auto bg-slate-50 px-4 py-4 space-y-3">
            <div className="bg-white border rounded-xl px-3 py-2 text-sm">
              Hi there 👋 <br />
              What exam or subject would you like help on?
            </div>

            {adminIsTyping && (
              <div className="bg-white border rounded-xl px-3 py-2 text-sm text-slate-500">
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
                      : "bg-white border"
                  }`}
                >
                  {m.body}

                  <div className="text-[10px] opacity-60 mt-1">
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
          <div className="border-t px-3 py-3 bg-white">
            <div className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your message..."
                className="flex-1 border rounded-full px-4 py-2 text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitChat();
                }}
              />

              <button
                onClick={submitChat}
                className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm"
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