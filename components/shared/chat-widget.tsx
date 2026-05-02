"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

interface Message {
    role: "user" | "assistant";
    content: string;
}

const HIDE_ON_PREFIXES = ["/admin", "/dashboard", "/login", "/register", "/forgot-password", "/reset-password", "/book"];
const MAX_INPUT = 1000;
const MAX_VIOLATIONS_BEFORE_LOCK = 3;

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [streaming, setStreaming] = useState(false);
    const [violations, setViolations] = useState(0);
    const [pathname, setPathname] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setPathname(window.location.pathname);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, streaming]);

    useEffect(() => {
        if (isOpen && inputRef.current && !streaming) {
            inputRef.current.focus();
        }
    }, [isOpen, streaming]);

    const locked = violations >= MAX_VIOLATIONS_BEFORE_LOCK;
    const shouldHide = HIDE_ON_PREFIXES.some(p => pathname.startsWith(p));
    if (shouldHide) return null;

    async function send(e: FormEvent) {
        e.preventDefault();
        const text = input.trim();
        if (!text || streaming || locked) return;

        const userMsg: Message = { role: "user", content: text };
        const nextMessages = [...messages, userMsg];
        setMessages(nextMessages);
        setInput("");
        setStreaming(true);
        setMessages(prev => [...prev, { role: "assistant", content: "" }]);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: nextMessages }),
            });

            if (!res.ok || !res.body) {
                throw new Error("Chat request failed");
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            let scopeStatus: "ok" | "refused" | undefined;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                    if (!line.startsWith("data: ")) continue;
                    const json = line.slice(6);
                    try {
                        const data = JSON.parse(json);
                        if (data.text) {
                            setMessages(prev => {
                                const last = prev[prev.length - 1];
                                if (last.role !== "assistant") return prev;
                                return [
                                    ...prev.slice(0, -1),
                                    { ...last, content: last.content + data.text },
                                ];
                            });
                        }
                        if (data.error) {
                            setMessages(prev => [
                                ...prev.slice(0, -1),
                                { role: "assistant", content: data.error },
                            ]);
                        }
                        if (data.done) {
                            scopeStatus = data.scope;
                        }
                    } catch {
                        // skip malformed line
                    }
                }
            }

            if (scopeStatus === "refused") {
                setViolations(v => v + 1);
            }
        } catch {
            setMessages(prev => [
                ...prev.slice(0, -1),
                {
                    role: "assistant",
                    content: "Chat is temporarily unavailable. Text us at (206) 641-4739.",
                },
            ]);
        } finally {
            setStreaming(false);
        }
    }

    return (
        <>
            {/* Floating button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    aria-label="Open chat"
                    className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-lg hover:bg-foreground/90 transition-all"
                >
                    <MessageCircle className="h-6 w-6" />
                </button>
            )}

            {/* Chat panel */}
            {isOpen && (
                <div className="fixed inset-x-0 bottom-0 md:inset-x-auto md:bottom-6 md:right-6 z-50 flex h-[80vh] md:h-[600px] w-full md:w-[400px] flex-col rounded-t-2xl md:rounded-2xl bg-background border border-border shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-border px-5 py-4">
                        <div>
                            <div className="font-semibold text-foreground">CLEENLY</div>
                            <div className="text-xs text-muted-foreground">Services, pricing, booking</div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            aria-label="Close chat"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                        {messages.length === 0 && (
                            <div className="text-sm text-muted-foreground space-y-3">
                                <p>Ask about our services, pricing, booking, or service areas.</p>
                                <p className="text-xs">Examples: <span className="italic">"How much for a 2-bedroom deep clean?"</span> · <span className="italic">"Do you serve Capitol Hill?"</span></p>
                            </div>
                        )}
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                                        m.role === "user"
                                            ? "bg-foreground text-background"
                                            : "bg-muted text-foreground"
                                    }`}
                                >
                                    {m.content || (streaming && i === messages.length - 1 && (
                                        <Loader2 className="h-4 w-4 animate-spin opacity-60" />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <form onSubmit={send} className="border-t border-border px-4 py-3">
                        {locked ? (
                            <div className="text-center py-2 text-xs text-muted-foreground">
                                Chat session ended. For booking text (206) 641-4739 or visit{" "}
                                <a href="/book" className="underline">cleenly.app/book</a>.
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT))}
                                    placeholder={streaming ? "..." : "Ask about CLEENLY"}
                                    disabled={streaming}
                                    className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm focus:border-foreground focus:outline-none disabled:opacity-50"
                                    maxLength={MAX_INPUT}
                                />
                                <button
                                    type="submit"
                                    disabled={streaming || !input.trim()}
                                    aria-label="Send"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background disabled:opacity-30 hover:bg-foreground/90 transition-colors"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            )}
        </>
    );
}
