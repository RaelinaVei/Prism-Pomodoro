import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Send, Loader2, Trash2, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LiveBackground } from "@/components/LiveBackground";
import { FullscreenButton } from "@/components/FullscreenButton";

type Msg = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "prismic-ai-chat";
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/study-chat`;

const suggestions = [
  "Explain photosynthesis simply",
  "Help me solve a quadratic equation",
  "Summarize Romeo & Juliet themes",
  "How do I balance chemical equations?",
  "Quick physics: what is momentum?",
];

const Lumi = () => {
  const [messages, setMessages] = useState<Msg[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Msg[]) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setError(null);
    const userMsg: Msg = { role: "user", content: trimmed };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantSoFar } : m,
          );
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const controller = new AbortController();
      abortRef.current = controller;
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: next }),
        signal: controller.signal,
      });

      if (!resp.ok || !resp.body) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${resp.status})`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let done = false;
      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) upsert(content);
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  const clearChat = () => {
    if (messages.length && !confirm("Clear this conversation?")) return;
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col">
      <LiveBackground variant="aurora" />

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-4">
        <Link
          to="/"
          className="glass rounded-full p-2.5 text-white hover:scale-110 transition-transform"
          title="Back to Home"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-xl sm:text-2xl font-bold text-white tracking-wide flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5" /> lumi
        </motion.h1>
        <button
          onClick={clearChat}
          className="glass rounded-full p-2.5 text-white hover:scale-110 transition-transform"
          title="Clear chat"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Chat area */}
      <div
        ref={scrollRef}
        className="relative z-10 flex-1 overflow-y-auto pt-20 pb-40 px-4 flex flex-col items-center"
      >
        <div className="w-full max-w-2xl flex flex-col gap-4">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-10"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4"
              >
                <Sparkles className="w-7 h-7 text-white" />
              </motion.div>
              <h2 className="font-display text-3xl font-bold text-white mb-2">hi, i'm lumi ✨</h2>
              <p className="text-white/70 font-body text-sm mb-8">
                your study companion — ask me anything about your subjects.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestions.map((s, i) => (
                  <motion.button
                    key={s}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.06 }}
                    onClick={() => send(s)}
                    className="glass rounded-full px-4 py-2 text-white/90 text-xs font-body hover:scale-105 hover:bg-white/15 transition-transform"
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/15 flex items-center justify-center mt-1">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`glass rounded-2xl px-4 py-3 max-w-[85%] text-sm font-body leading-relaxed ${
                    m.role === "user"
                      ? "bg-white/15 text-white rounded-br-sm"
                      : "text-white/95 rounded-bl-sm"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <div className="prose prose-invert prose-sm max-w-none prose-p:my-2 prose-headings:text-white prose-strong:text-white prose-code:text-white prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/10 prose-a:text-sky-200">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {m.content || "…"}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  )}
                </div>
                {m.role === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/15 flex items-center justify-center mt-1">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/15 flex items-center justify-center mt-1">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="glass rounded-2xl px-4 py-3 text-white/80 text-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> thinking…
              </div>
            </div>
          )}

          {error && (
            <div className="glass rounded-xl p-3 text-rose-200 text-xs font-body text-center">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="fixed bottom-0 left-0 right-0 z-20 px-4 pb-5 pt-3 bg-gradient-to-t from-black/40 to-transparent">
        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="max-w-2xl mx-auto glass rounded-2xl flex items-end gap-2 p-2"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Ask lumi anything…"
            rows={1}
            className="flex-1 bg-transparent text-white placeholder:text-white/50 text-sm font-body px-3 py-2 focus:outline-none resize-none max-h-32"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="rounded-xl bg-white/20 hover:bg-white/30 disabled:opacity-40 disabled:hover:bg-white/20 text-white p-2.5 transition-colors"
            title="Send"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
        <p className="text-center text-white/40 text-[10px] font-body mt-2">
          lumi can make mistakes — double-check important info.
        </p>
      </div>

      <FullscreenButton />
    </div>
  );
};

export default Lumi;
