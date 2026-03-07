"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGE: Message = {
  id: "init",
  role: "assistant",
  content:
    "안녕하세요 😊 저는 솔이예요. 혼자 있는 시간이 길어질 때, 누군가와 이야기하고 싶을 때 언제든 찾아오세요. 오늘 어떠셨어요?",
};

const QUICK_PROMPTS = [
  "요즘 부쩍 외로워요",
  "잠이 잘 안 와요",
  "은퇴 후 무기력한 느낌이에요",
  "자녀들과 연락이 뜸해요",
  "오늘 하루 아무도 못 만났어요",
  "그냥 얘기 상대가 필요해요",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [input]);

  async function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    const userText = input.trim();
    if (!userText || isLoading) return;

    const updatedMessages: Message[] = [
      ...messages,
      { id: crypto.randomUUID(), role: "user", content: userText },
    ];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok) {
        let message = "잠시 연결에 문제가 생겼어요. 잠깐 후에 다시 말씀해 주세요.";
        try {
          const data = await res.json() as { error?: string };
          if (data?.error) message = data.error;
        } catch {
          // JSON 파싱 실패 시 기본 메시지 유지
        }
        toast.error(message);
        throw new Error(message);
      }

      if (!res.body) throw new Error("응답을 받을 수 없습니다.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          updated[updated.length - 1] = {
            ...last,
            content: last.content + chunk,
          };
          return updated;
        });
      }
    } catch (err) {
      const apiMessage =
        err instanceof Error && err.message && !/fetch|network|ECONNREFUSED/i.test(err.message)
          ? err.message
          : null;
      const fallbackMessage =
        apiMessage ?? "죄송해요, 잠시 연결에 문제가 생겼어요. 잠깐 후에 다시 말씀해 주세요.";
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        updated[updated.length - 1] = {
          ...last,
          content: fallbackMessage,
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="flex items-center gap-4 h-16 px-4 md:px-8 bg-white border-b border-slate-100 shrink-0">
        <Link
          href="/"
          className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-slate-100 transition-colors text-slate-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#1152d4] to-blue-400 flex items-center justify-center text-white font-bold text-sm">
              솔
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">솔이</p>
            <p className="text-xs text-slate-400">50·60대 중장년 AI 동반자</p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#1152d4] to-blue-400 flex items-center justify-center text-white text-xs font-bold shrink-0 mb-0.5">
                솔
              </div>
            )}
            <div
              className={`max-w-[75%] md:max-w-[60%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-[#1152d4] text-white rounded-br-sm"
                  : "bg-white text-slate-800 rounded-bl-sm shadow-sm border border-slate-100"
              }`}
            >
              {msg.content}
              {msg.role === "assistant" && msg.content === "" && isLoading && (
                <span className="inline-flex gap-1 items-center h-4">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </main>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="shrink-0 bg-white border-t border-slate-100 px-4 md:px-8 pt-3 pb-4"
      >
        {/* Quick prompt chips — only show when no user message yet */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 max-w-3xl mx-auto mb-3">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setInput(prompt)}
                className="px-3 py-1.5 rounded-full text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-[#1152d4] hover:text-[#1152d4] transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-end gap-3 max-w-3xl mx-auto">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요… (Shift+Enter로 줄바꿈)"
            rows={1}
            disabled={isLoading}
            className="flex-1 resize-none rounded-2xl border border-slate-200 bg-[#FAFAFA] px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1152d4]/30 focus:border-[#1152d4] transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-11 h-11 rounded-full bg-[#1152d4] hover:bg-blue-700 disabled:bg-slate-200 transition-colors flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4 text-white disabled:text-slate-400" />
          </button>
        </div>
      </form>
    </div>
  );
}
