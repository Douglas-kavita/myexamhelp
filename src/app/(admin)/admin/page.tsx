"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../../../lib/supabaseBrowser";

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
  const [info, setInfo] = useState<string | null>(null);
  const [unreadIds, setUnreadIds] = useState<string[]>([]);

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

  const typingOffTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function setTypingStatus(isTyping: boolean) {
    if (!activeId) return;

    await supabase.from("typing").upsert(
      {
        conversation_id: activeId,
        admin_typing: isTyping,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "conversation_id" }
    );
  }

  function scrollToBottom(smooth = false) {
    requestAnimationFrame(() => {
      scrollerRef.current?.scrollTo({
        top: scrollerRef.current.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    });
  }

  function markRead(conversationId: string) {
    setUnreadIds((prev) => prev.filter((id) => id !== conversationId));
  }

  function markUnread(conversationId: string) {
    setUnreadIds((prev) =>
      prev.includes(conversationId) ? prev : [conversationId, ...prev]
    );
  }

  async function loadConversations(preferredActiveId?: string | null) {
    setErr(null);

    const { data: conversationData, error: conversationError } = await supabase
      .from("conversations")
      .select("*")
      .order("created_at", { ascending: false });

    if (conversationError) {
      setErr(conversationError.message);
      return;
    }

    const rawRows = (conversationData as Conversation[]) ?? [];

    // Keep only the newest conversation per client so one client
    // does not appear as many separate inbox entries.
    const latestByUser = new Map<string, Conversation>();
    for (const row of rawRows) {
      if (!latestByUser.has(row.user_id)) {
        latestByUser.set(row.user_id, row);
      }
    }

    const rows = Array.from(latestByUser.values());
    setConversations(rows);

    const { data: messageData, error: messageError } = await supabase
      .from("messages")
      .select("conversation_id, sender, created_at")
      .order("created_at", { ascending: false });

    if (!messageError && messageData) {
      const latestByConversation = new Map<string, "visitor" | "admin">();

      for (const row of messageData as Array<{
        conversation_id: string;
        sender: "visitor" | "admin";
        created_at: string;
      }>) {
        if (!latestByConversation.has(row.conversation_id)) {
          latestByConversation.set(row.conversation_id, row.sender);
        }
      }

      const nextUnreadIds = rows
        .filter((c) => latestByConversation.get(c.id) === "visitor")
        .map((c) => c.id);

      setUnreadIds(nextUnreadIds);
    }

    if (preferredActiveId) {
      setActiveId(preferredActiveId);
      return;
    }

    if (!activeId && rows[0]?.id) {
      setActiveId(rows[0].id);
    }
  }

  async function loadMessages(conversationId: string) {
    setErr(null);

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      setErr(error.message);
      return;
    }

    setMessages((data as Msg[]) ?? []);
    scrollToBottom(false);
  }

  async function handleRefresh() {
    await loadConversations(activeId);
    if (activeId) {
      await loadMessages(activeId);
      markRead(activeId);
    }
  }

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

  useEffect(() => {
    if (!isAuthed) return;
    loadConversations();
  }, [isAuthed]);

  useEffect(() => {
    if (!isAuthed || !activeId) return;
    loadMessages(activeId);
    markRead(activeId);
  }, [isAuthed, activeId]);

  // Realtime for currently open thread
  useEffect(() => {
    if (!isAuthed || !activeId) return;

    const activeChannel = supabase
      .channel(`admin-active-messages:${activeId}`)
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

          setMessages((prev) => {
            const exists = prev.some((m) => m.id === newMsg.id);
            if (exists) return prev;
            return [...prev, newMsg];
          });

          if (newMsg.sender === "visitor") {
            playPop();
            markRead(activeId);
          }

          scrollToBottom(true);
        }
      )
      .subscribe((status) => {
        console.log("ADMIN realtime status:", status);
      });

    return () => {
      supabase.removeChannel(activeChannel);
    };
  }, [isAuthed, activeId]);

  // Realtime for whole inbox
  useEffect(() => {
    if (!isAuthed) return;

    const inboxChannel = supabase
      .channel("admin-inbox-updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "conversations",
        },
        async (payload) => {
          const newConversation = payload.new as Conversation;
          await loadConversations(newConversation.id);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          const newMsg = payload.new as Msg;

          await loadConversations(activeId);

          if (newMsg.sender === "visitor" && newMsg.conversation_id !== activeId) {
            markUnread(newMsg.conversation_id);
            playPop();
          }

          if (newMsg.sender === "admin") {
            setUnreadIds((prev) => prev.filter((id) => id !== newMsg.conversation_id));
          }
        }
      )
      .subscribe((status) => {
        console.log("ADMIN inbox realtime status:", status);
      });

    return () => {
      supabase.removeChannel(inboxChannel);
    };
  }, [isAuthed, activeId]);

  async function signIn() {
    setErr(null);
    setInfo(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setErr(error.message);
  }

  async function sendResetPassword() {
    setErr(null);
    setInfo(null);

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setErr("Enter your email first, then click Forgot password.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: "https://myexamhelp-1gfx.vercel.app/reset-password",
    });

    if (error) {
      setErr(error.message);
      return;
    }

    setInfo("Password reset email sent. Open the newest email and use that link.");
  }

  async function signOut() {
    await supabase.auth.signOut();
    setConversations([]);
    setMessages([]);
    setActiveId(null);
    setUnreadIds([]);
  }

  async function sendReply() {
    if (!activeId) return;

    const trimmed = reply.trim();
    if (!trimmed) return;

    const tempId = crypto.randomUUID();

    const tempMessage: Msg = {
      id: tempId,
      created_at: new Date().toISOString(),
      conversation_id: activeId,
      sender: "admin",
      body: trimmed,
    };

    // Show instantly on admin page
    setMessages((prev) => [...prev, tempMessage]);
    setReply("");
    void setTypingStatus(false);
    markRead(activeId);
    scrollToBottom(true);

    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: activeId,
        sender: "admin",
        body: trimmed,
      })
      .select("*")
      .single();

    if (error) {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setErr(error.message);
      return;
    }

    if (data) {
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? (data as Msg) : m))
      );
    }
  }

  if (!sessionReady) {
    return (
      <main className="fixed inset-0 z-[10000] grid place-items-center bg-slate-100">
        <div className="text-sm text-slate-500">Loading admin…</div>
      </main>
    );
  }

  if (!isAuthed) {
    return (
      <main className="fixed inset-0 z-[10000] overflow-y-auto bg-slate-100">
        <header className="border-b border-slate-200 bg-slate-950 text-white shadow-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <div>
              <div className="text-xl font-bold tracking-wide">MyExamHelp Admin</div>
              <div className="text-xs text-slate-300">Secure inbox access</div>
            </div>
          </div>
        </header>

        <div className="grid min-h-[calc(100vh-73px)] place-items-center px-4 py-10">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="text-2xl font-bold text-slate-900">Admin Login</div>
            <div className="mt-1 text-sm text-slate-500">
              Sign in to view and reply to chats.
            </div>

            <input
              className="mt-5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-900/10"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="mt-3 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-900/10"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") signIn();
              }}
            />

            {err && (
              <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {err}
              </div>
            )}

            {info && (
              <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {info}
              </div>
            )}

            <button
              onClick={signIn}
              className="mt-4 w-full rounded-2xl bg-slate-950 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Sign in
            </button>

            <button
              onClick={sendResetPassword}
              className="mt-4 w-full text-sm font-medium text-slate-600 underline underline-offset-4 hover:text-slate-900"
            >
              Forgot password?
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="fixed inset-0 z-[10000] overflow-y-auto bg-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950 text-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <div className="text-xl font-bold tracking-wide">MyExamHelp Admin</div>
            <div className="text-xs text-slate-300">
              Conversations, replies, and live support inbox
            </div>
          </div>

          <button
            onClick={signOut}
            className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-200"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-5">
        {err && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
            {err}
          </div>
        )}

        <div className="grid grid-cols-12 gap-5">
          <section className="col-span-12 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.08)] md:col-span-4">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
              <div>
                <div className="text-base font-bold text-slate-900">Client Inbox</div>
                <div className="text-xs text-slate-500">
                  Blue dot = latest message from client
                </div>
              </div>

              <button
                onClick={handleRefresh}
                className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Refresh
              </button>
            </div>

            <div className="max-h-[76vh] overflow-y-auto bg-slate-50/50">
              {conversations.length === 0 ? (
                <div className="p-4 text-sm text-slate-500">No conversations yet.</div>
              ) : (
                conversations.map((c) => {
                  const isUnread = unreadIds.includes(c.id);
                  const isCurrent = activeId === c.id;

                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setActiveId(c.id);
                        markRead(c.id);
                      }}
                      className={`w-full border-b border-slate-200 px-4 py-4 text-left transition ${
                        isCurrent
                          ? "bg-blue-50 ring-1 ring-inset ring-blue-100"
                          : "bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-base font-bold text-slate-900">
                            {c.ticket_no ? `MEH-${c.ticket_no}` : "MEH"} •{" "}
                            {c.subject?.trim() ? c.subject : "No subject"}
                          </div>

                          <div className="mt-1 text-xs text-slate-500">
                            {new Date(c.created_at).toLocaleString()}
                          </div>

                          <div className="mt-2 truncate text-[11px] text-slate-400">
                            Client: {c.user_id}
                          </div>
                        </div>

                        {isUnread && !isCurrent ? (
                          <div className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-blue-600" />
                        ) : null}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </section>

          <section className="col-span-12 flex min-h-[76vh] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.08)] md:col-span-8">
            <div className="border-b border-slate-200 bg-white px-5 py-4">
              <div className="text-lg font-bold text-slate-900">Messages</div>
              <div className="mt-1 text-xs text-slate-500">
                {activeId ? `Conversation: ${activeId}` : "Select a conversation"}
              </div>
            </div>

            <div
              ref={scrollerRef}
              className="flex-1 space-y-4 overflow-y-auto bg-slate-50 px-5 py-5"
            >
              {activeId ? (
                messages.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-sm text-slate-500">
                    No messages yet.
                  </div>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${
                        m.sender === "admin" ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div className="max-w-[78%]">
                        <div
                          className={`rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm whitespace-pre-wrap ${
                            m.sender === "admin"
                              ? "rounded-bl-md bg-slate-200 text-slate-900"
                              : "rounded-br-md bg-blue-900 text-white"
                          }`}
                        >
                          {m.body}
                        </div>

                        <div
                          className={`mt-1 px-1 text-[11px] text-slate-400 ${
                            m.sender === "admin" ? "text-left" : "text-right"
                          }`}
                        >
                          {new Date(m.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                )
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-sm text-slate-500">
                  Pick a client conversation from the left.
                </div>
              )}
            </div>

            {activeId && (
              <div className="border-t border-slate-200 bg-white px-4 py-4">
                <div className="flex items-end gap-3">
                  <textarea
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
                    rows={3}
                    className="flex-1 resize-none rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-900/10"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        sendReply();
                      }
                    }}
                  />

                  <button
                    onClick={sendReply}
                    className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Send
                  </button>
                </div>

                <div className="mt-2 text-[11px] text-slate-400">
                  Enter = new line • Ctrl + Enter to send
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}