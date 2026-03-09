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

const ADMIN_EMAIL = "admin@myexamhelp.com"; // change if needed

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [sessionReady, setSessionReady] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [authError, setAuthError] = useState("");
  const [pageError, setPageError] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // -----------------------------
  // local unread tracking
  // -----------------------------
  const getReadMap = (): Record<string, string> => {
    if (typeof window === "undefined") return {};
    try {
      const raw = localStorage.getItem("admin-read-map");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const setConversationRead = (conversationId: string, isoTime: string) => {
    if (typeof window === "undefined") return;
    const map = getReadMap();
    map[conversationId] = isoTime;
    localStorage.setItem("admin-read-map", JSON.stringify(map));
  };

  const getConversationReadTime = (conversationId: string) => {
    const map = getReadMap();
    return map[conversationId] || null;
  };

  // -----------------------------
  // auth/session
  // -----------------------------
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      setIsAuthed(!!session);
      setSessionReady(true);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session);
      setSessionReady(true);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    setAuthError("");

    if (!email || !password) {
      setAuthError("Enter email and password.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError(error.message);
      return;
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setConversations([]);
    setMessages([]);
    setActiveId(null);
  };

  // -----------------------------
  // data loading
  // -----------------------------
  const loadConversations = async () => {
    try {
      setLoadingConversations(true);
      setPageError("");

      const { data, error } = await supabase
        .from("conversations")
        .select("id, created_at, user_id, subject, status, ticket_no")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setConversations((data || []) as Conversation[]);
    } catch (err: any) {
      setPageError(err.message || "Failed to load conversations.");
    } finally {
      setLoadingConversations(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      setLoadingMessages(true);
      setPageError("");

      const { data, error } = await supabase
        .from("messages")
        .select("id, created_at, conversation_id, sender, body")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const rows = (data || []) as Msg[];
      setMessages(rows);

      // mark as read up to latest visitor message when opening thread
      const lastVisitorMsg = [...rows]
        .reverse()
        .find((m) => m.sender === "visitor");

      if (lastVisitorMsg) {
        setConversationRead(conversationId, lastVisitorMsg.created_at);
      } else {
        setConversationRead(conversationId, new Date().toISOString());
      }
    } catch (err: any) {
      setPageError(err.message || "Failed to load messages.");
    } finally {
      setLoadingMessages(false);
    }
  };

  // first load after login
  useEffect(() => {
    if (!sessionReady || !isAuthed) return;
    loadConversations();
  }, [sessionReady, isAuthed]);

  // open first conversation automatically
  useEffect(() => {
    if (!activeId && conversations.length > 0) {
      setActiveId(conversations[0].id);
    }
  }, [conversations, activeId]);

  // load messages when active conversation changes
  useEffect(() => {
    if (!activeId) return;
    loadMessages(activeId);
  }, [activeId]);

  // scroll messages down
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // -----------------------------
  // realtime refresh
  // -----------------------------
  useEffect(() => {
    if (!isAuthed) return;

    const channel = supabase
      .channel("admin-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversations" },
        async () => {
          await loadConversations();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        async (payload) => {
          await loadConversations();

          const newRow = payload.new as Msg | undefined;
          if (newRow?.conversation_id && newRow.conversation_id === activeId) {
            await loadMessages(activeId);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthed, activeId]);

  // -----------------------------
  // unread logic
  // -----------------------------
  const unreadMap = useMemo(() => {
    const result: Record<string, boolean> = {};

    for (const convo of conversations) {
      result[convo.id] = false;
    }

    return result;
  }, [conversations]);

  const [messageCache, setMessageCache] = useState<Record<string, Msg[]>>({});

  const refreshUnreadCache = async () => {
    if (!conversations.length) {
      setMessageCache({});
      return;
    }

    const ids = conversations.map((c) => c.id);

    const { data, error } = await supabase
      .from("messages")
      .select("id, created_at, conversation_id, sender, body")
      .in("conversation_id", ids)
      .order("created_at", { ascending: true });

    if (error) return;

    const grouped: Record<string, Msg[]> = {};
    for (const row of (data || []) as Msg[]) {
      if (!grouped[row.conversation_id]) grouped[row.conversation_id] = [];
      grouped[row.conversation_id].push(row);
    }
    setMessageCache(grouped);
  };

  useEffect(() => {
    if (!isAuthed || conversations.length === 0) return;
    refreshUnreadCache();
  }, [isAuthed, conversations]);

  const hasUnread = (conversationId: string) => {
    const rows = messageCache[conversationId] || [];
    const lastRead = getConversationReadTime(conversationId);

    const unreadVisitor = rows.some((m) => {
      if (m.sender !== "visitor") return false;
      if (!lastRead) return true;
      return new Date(m.created_at).getTime() > new Date(lastRead).getTime();
    });

    return unreadVisitor;
  };

  // when active messages change, sync cache for active thread
  useEffect(() => {
    if (!activeId) return;
    setMessageCache((prev) => ({
      ...prev,
      [activeId]: messages,
    }));
  }, [messages, activeId]);

  // -----------------------------
  // send reply
  // -----------------------------
  const handleSend = async () => {
    if (!activeId || !reply.trim()) return;

    try {
      setSending(true);
      setPageError("");

      const cleanReply = reply.trim();

      const { error } = await supabase.from("messages").insert({
        conversation_id: activeId,
        sender: "admin",
        body: cleanReply,
      });

      if (error) throw error;

      setReply("");

      await loadMessages(activeId);
      await loadConversations();
      await refreshUnreadCache();
    } catch (err: any) {
      setPageError(err.message || "Failed to send reply.");
    } finally {
      setSending(false);
    }
  };

  const activeConversation = conversations.find((c) => c.id === activeId);

  // -----------------------------
  // UI
  // -----------------------------
  if (!sessionReady) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow p-6">Loading admin...</div>
      </main>
    );
  }

  if (!isAuthed) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin Login</h1>
          <p className="text-sm text-slate-600 mb-5">
            Sign in with your Supabase admin account.
          </p>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />

            {authError ? (
              <div className="rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">
                {authError}
              </div>
            ) : null}

            <button
              onClick={handleLogin}
              className="w-full rounded-xl bg-blue-600 text-white py-3 font-medium hover:bg-blue-700"
            >
              Log in
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="h-screen grid grid-cols-1 md:grid-cols-[340px_1fr]">
        {/* Sidebar */}
        <aside className="border-r border-slate-200 bg-white flex flex-col">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Admin Inbox</h1>
              <p className="text-xs text-slate-500">{ADMIN_EMAIL}</p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
            >
              Logout
            </button>
          </div>

          <div className="p-3 border-b border-slate-200">
            <button
              onClick={async () => {
                await loadConversations();
                if (activeId) await loadMessages(activeId);
                await refreshUnreadCache();
              }}
              className="w-full rounded-xl bg-slate-900 text-white py-2.5 text-sm font-medium hover:bg-slate-800"
            >
              Refresh
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingConversations ? (
              <div className="p-4 text-sm text-slate-500">Loading conversations...</div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-sm text-slate-500">No conversations found.</div>
            ) : (
              conversations.map((convo) => {
                const unread = hasUnread(convo.id);
                const isActive = activeId === convo.id;

                return (
                  <button
                    key={convo.id}
                    onClick={() => setActiveId(convo.id)}
                    className={`w-full text-left px-4 py-4 border-b border-slate-100 hover:bg-slate-50 ${
                      isActive ? "bg-blue-50" : "bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 truncate">
                          {convo.subject || `Conversation #${convo.ticket_no ?? "—"}`}
                        </div>
                        <div className="text-xs text-slate-500 mt-1 truncate">
                          {convo.user_id}
                        </div>
                      </div>

                      {unread ? (
                        <span className="mt-1 h-3 w-3 rounded-full bg-blue-600 shrink-0" />
                      ) : null}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Chat area */}
        <section className="flex flex-col h-screen">
          <div className="border-b border-slate-200 bg-white px-5 py-4">
            <h2 className="text-lg font-bold text-slate-900">
              {activeConversation?.subject ||
                `Conversation #${activeConversation?.ticket_no ?? "—"}`}
            </h2>
            <p className="text-sm text-slate-500">
              {activeConversation?.user_id || "Select a conversation"}
            </p>
          </div>

          {pageError ? (
            <div className="m-4 rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">
              {pageError}
            </div>
          ) : null}

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {!activeId ? (
              <div className="text-sm text-slate-500">Select a conversation.</div>
            ) : loadingMessages ? (
              <div className="text-sm text-slate-500">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="text-sm text-slate-500">No messages yet.</div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    msg.sender === "admin"
                      ? "ml-auto bg-blue-600 text-white"
                      : "bg-white text-slate-900"
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">{msg.body}</div>
                  <div
                    className={`mt-2 text-[11px] ${
                      msg.sender === "admin" ? "text-blue-100" : "text-slate-400"
                    }`}
                  >
                    {new Date(msg.created_at).toLocaleString()}
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-slate-200 bg-white p-4">
            <div className="flex gap-3">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your reply..."
                rows={3}
                className="flex-1 resize-none rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSend}
                disabled={sending || !reply.trim() || !activeId}
                className="self-end rounded-2xl bg-blue-600 text-white px-5 py-3 font-medium disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}