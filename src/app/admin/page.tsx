"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../../lib/supabaseBrowser"; // <-- correct relative import for src/app/admin/page.tsx

type Conversation = {
  id: string;
  created_at: string;
  user_id: string;
  subject: string | null;
  status: string;
    ticket_no: number | null; 
};

type Msg = {
  id: string;
  created_at: string;
  conversation_id: string;
  sender: "visitor" | "admin";
  body: string;
};

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [sessionReady, setSessionReady] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [reply, setReply] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const pop = useMemo(
  () => (typeof Audio !== "undefined" ? new Audio("/sounds/pop.mp3") : null),
  []
);

const playPop = () => {
  try {
    if (!pop) return;
    pop.currentTime = 0;
    void pop.play();
  } catch {}
};
    const [adminTyping, setAdminTyping] = useState(false);
const typingOffTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

async function setTypingStatus(isTyping: boolean) {
  if (!activeId) return;
  setAdminTyping(isTyping);

  await supabase.from("typing").upsert(
    {
      conversation_id: activeId,
      admin_typing: isTyping,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "conversation_id" }
  );
}

  // 0) Auth session
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthed(!!data.session);
      setSessionReady(true);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  // 1) Load conversations once authed
  useEffect(() => {
    if (!isAuthed) return;
    loadConversations();
  }, [isAuthed]);

  async function loadConversations() {
    setErr(null);
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setErr(error.message);
      return;
    }
    setConversations((data as Conversation[]) ?? []);
    if (!activeId && data?.[0]?.id) {
      setActiveId(data[0].id);
    }
  }

  // 2) Load messages whenever active conversation changes
  useEffect(() => {
    if (!isAuthed) return;
    if (!activeId) return;
    loadMessages(activeId);
  }, [isAuthed, activeId]);

  async function loadMessages(conversation_id: string) {
    setErr(null);
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversation_id)
      .order("created_at", { ascending: true });

    if (error) {
      setErr(error.message);
      return;
    }
    setMessages((data as Msg[]) ?? []);

    // scroll to bottom
    requestAnimationFrame(() => {
      scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight });
    });
  }

  // 3) Realtime for active conversation
  useEffect(() => {
    if (!isAuthed) return;
    if (!activeId) return;

    const channel = supabase
      .channel(`admin-messages:${activeId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${activeId}`,
        },
            (payload) => {
           const newMsg = payload.new as Msg;

          setMessages((prev) => [...prev, newMsg]);

         // 🔔 POP only when visitor sends
         if (newMsg.sender === "visitor") {
           playPop();
              }
          requestAnimationFrame(() => {
            scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthed, activeId]);

  async function signIn() {
    setErr(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setErr(error.message);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setConversations([]);
    setMessages([]);
    setActiveId(null);
  }

  async function sendReply() {
    if (!activeId) return;
    const trimmed = reply.trim();
    if (!trimmed) return;

    setReply("");

    
    const { error } = await supabase.from("messages").insert({
      conversation_id: activeId,
      sender: "admin",
      body: trimmed,
    });

    if (error) setErr(error.message);
  }

  // ---- UI ----
  if (!sessionReady) {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-50">
        <div className="text-sm text-slate-500">Loading admin…</div>
      </main>
    );
  }

  if (!isAuthed) {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border bg-white p-5 shadow-xl">
          <div className="text-xl font-semibold">Admin Login</div>
          <div className="mt-1 text-sm text-slate-500">Sign in to view and reply to chats.</div>

          <input
            className="mt-4 w-full rounded-xl border px-3 py-2 text-sm"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="mt-2 w-full rounded-xl border px-3 py-2 text-sm"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") signIn();
            }}
          />

          {err && <div className="mt-3 text-sm text-red-600">{err}</div>}

          <button
            onClick={signIn}
            className="mt-3 w-full rounded-xl bg-slate-900 text-white py-2 text-sm hover:bg-slate-800"
          >
            Sign in
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-semibold">Admin Inbox</div>
            <div className="text-sm text-slate-500">View conversations and reply in real-time.</div>
          </div>
          <button
            onClick={signOut}
            className="rounded-xl border bg-white px-4 py-2 text-sm hover:bg-slate-100"
          >
            Sign out
          </button>
        </div>

        {err && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        )}

        <div className="grid grid-cols-12 gap-4">
          {/* Left: conversation list */}
          <div className="col-span-12 md:col-span-4 rounded-2xl border bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="font-semibold">Conversations</div>
              <button
                onClick={loadConversations}
                className="text-xs rounded-lg border px-2 py-1 hover:bg-slate-100"
              >
                Refresh
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-4 text-sm text-slate-500">No conversations yet.</div>
              ) : (
                conversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveId(c.id)}
                    className={`w-full text-left px-4 py-3 border-b hover:bg-slate-50 ${
                      activeId === c.id ? "bg-slate-100" : "bg-white"
                    }`}
                  >
                    <div className="text-sm font-medium">
                     {c.ticket_no ? `MEH-${c.ticket_no}` : "MEH"} • {c.subject?.trim() ? c.subject : "No subject"}
                    </div>

                    <div className="mt-0.5 text-xs text-slate-500">
                      {new Date(c.created_at).toLocaleString()}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-400 truncate">Visitor: {c.user_id}</div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right: messages */}
          <div className="col-span-12 md:col-span-8 rounded-2xl border bg-white shadow-sm overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b">
              <div className="font-semibold">Chat</div>
              <div className="text-xs text-slate-500">
                {activeId ? `Conversation: ${activeId}` : "Select a conversation"}
              </div>
            </div>

            <div ref={scrollerRef} className="flex-1 bg-slate-50 px-4 py-4 overflow-y-auto space-y-3">
              {activeId ? (
                messages.length === 0 ? (
                  <div className="text-sm text-slate-500">No messages yet.</div>
                ) : (
                  messages.map((m) => (
                    <div key={m.id} className={`flex ${m.sender === "admin" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                          m.sender === "admin"
                            ? "bg-slate-900 text-white rounded-br-md"
                            : "bg-white border text-slate-800 rounded-bl-md"
                        }`}
                      >
                        {m.body}
                        <div className={`mt-1 text-[10px] ${m.sender === "admin" ? "text-white/60" : "text-slate-400"}`}>
                          {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  ))
                )
              ) : (
                <div className="text-sm text-slate-500">Pick a conversation on the left.</div>
              )}
            </div>

            {activeId && (
              <div className="border-t bg-white px-3 py-3">
                <div className="flex items-center gap-2">
                   <input
                 value={reply}
                onChange={(e) => {
               const v = e.target.value;
                  setReply(v);

               void setTypingStatus(v.trim().length > 0);

              if (typingOffTimer.current) {
               clearTimeout(typingOffTimer.current);
                }

                typingOffTimer.current = setTimeout(() => {
            void setTypingStatus(false);
    }, 1200);
  }}
  placeholder="Type your reply…"
  className="flex-1 rounded-full border px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
  onKeyDown={(e) => {
    if (e.key === "Enter") sendReply();
     setTypingStatus(false);
  }}
/>
                  <button
                    onClick={sendReply}
                    className="rounded-full bg-slate-900 text-white px-4 py-2 text-sm hover:bg-slate-800"
                  >
                    Send
                  </button>
                </div>
                <div className="mt-2 text-[11px] text-slate-400">Press Enter to send</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}