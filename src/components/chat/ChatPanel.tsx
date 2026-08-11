"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { api, formatDateTime, type ChatMessage } from "@/lib/api";

const POLL_MS = 3000;

/**
 * Chat about one booked appointment.
 *
 * Polls for new messages every few seconds, asking only for messages after the
 * newest id it already holds, so a long thread isn't re-fetched each tick.
 */
export function ChatPanel({ requestId, title = "Chat" }: { requestId: number; title?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const lastIdRef = useRef(0);
  const inFlightRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const poll = useCallback(async () => {
    // Two overlapping requests would both start from the same `after` cursor
    // and append the same rows twice, so only ever run one at a time.
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    try {
      const data = await api.get<{ messages: ChatMessage[] }>(
        `/messages/${requestId}?after=${lastIdRef.current}`
      );
      if (data.messages.length > 0) {
        lastIdRef.current = Math.max(lastIdRef.current, data.messages[data.messages.length - 1].id);
        // Merge by id as well - belt and braces against any repeat delivery.
        setMessages((prev) => {
          const seen = new Set(prev.map((m) => m.id));
          const fresh = data.messages.filter((m) => !seen.has(m.id));
          return fresh.length ? [...prev, ...fresh] : prev;
        });
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chat unavailable");
    } finally {
      inFlightRef.current = false;
    }
  }, [requestId]);

  // Reset when switching to a different appointment's thread.
  useEffect(() => {
    lastIdRef.current = 0;
    setMessages([]);
  }, [requestId]);

  useEffect(() => {
    poll();
    const timer = setInterval(poll, POLL_MS);
    return () => clearInterval(timer);
  }, [poll]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = draft.trim();
    if (!body || sending) return;

    setSending(true);
    try {
      await api.post(`/messages/${requestId}`, { body });
      setDraft("");
      await poll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-white/70 rounded-[2rem] border border-white overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
        <h4 className="font-black text-gray-900">{title}</h4>
        <span className="text-xs font-bold text-gray-400">{messages.length} messages</span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5 space-y-4">
        {messages.length === 0 && !error && (
          <p className="text-sm text-gray-400 font-medium text-center py-8">
            No messages yet. Say hello.
          </p>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
              m.mine ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
            }`}>
              <p className="text-sm font-medium whitespace-pre-wrap break-words">{m.body}</p>
              <p className={`text-[10px] mt-1.5 font-bold ${m.mine ? "text-white/50" : "text-gray-400"}`}>
                {m.senderRole === "ADMIN" ? "Harmony" : "Company"} &middot; {formatDateTime(m.createdAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {error && (
        <p className="px-6 py-2 text-xs font-bold text-red-600 bg-red-50 flex-shrink-0">{error}</p>
      )}

      <form onSubmit={send} className="p-4 border-t border-gray-100 flex gap-2 flex-shrink-0">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write a message..."
          className="flex-1 px-4 py-3 rounded-full bg-gray-50 border border-gray-200 text-sm font-medium outline-none focus:border-[#F5841F] transition-colors"
        />
        <button
          type="submit"
          disabled={!draft.trim() || sending}
          className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center flex-shrink-0 disabled:opacity-40 hover:scale-105 transition-transform"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
