"use client";

import { useState, useRef, useEffect, FormEvent, CSSProperties } from "react";
import { usePathname } from "next/navigation";
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
    const [isMobile, setIsMobile] = useState(false);
    const [panelStyle, setPanelStyle] = useState<CSSProperties | undefined>(undefined);
    const pathname = usePathname() || "/";
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 767px)");
        const update = () => setIsMobile(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);

    // On mobile the panel is sized and positioned from the visual viewport, not
    // from vh/bottom-0. Otherwise the on-screen keyboard (and the browser's own
    // bottom toolbar) covers the input row and the message can't be typed.
    useEffect(() => {
        if (!isOpen || !isMobile) {
            setPanelStyle(undefined);
            return;
        }

        const vv = window.visualViewport;

        const update = () => {
            const height = vv?.height ?? window.innerHeight;
            const inset = vv
                ? Math.max(0, window.innerHeight - vv.height - vv.offsetTop)
                : 0;
            setPanelStyle({ height: `${Math.round(height)}px`, bottom: `${Math.round(inset)}px` });
        };

        update();
        vv?.addEventListener("resize", update);
        vv?.addEventListener("scroll", update);
        window.addEventListener("resize", update);
        return () => {
            vv?.removeEventListener("resize", update);
            vv?.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, [isOpen, isMobile]);

    // Full-screen sheet on mobile — stop the page behind it from scrolling.
    useEffect(() => {
        if (!isOpen || !isMobile) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
    }, [isOpen, isMobile]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, streaming]);

    // Desktop only: autofocus on mobile fights the keyboard and scrolls the page.
    useEffect(() => {
        if (isMobile || !isOpen || streaming) return;
        inputRef.current?.focus({ preventScroll: true });
    }, [isOpen, streaming, isMobile]);

    const locked = violations >= MAX_VIOLATIONS_BEFORE_LOCK;
    const shouldHide = HIDE_ON_PREFIXES.some(p => pathname.startsWith(p));

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

    if (shouldHide) return null;

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
                <div
                    style={panelStyle}
                    className="fixed inset-x-0 bottom-0 md:inset-x-auto md:bottom-6 md:right-6 z-50 flex h-[100dvh] md:h-[600px] w-full md:w-[400px] max-w-full flex-col overflow-hidden md:rounded-2xl bg-background border border-border shadow-2xl"
                >
                    {/* Header */}
                    <div className="flex shrink-0 items-center justify-between bg-accent px-5 py-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-background">CLEENLY</span>
                                <span className="flex items-center gap-1.5 text-[11px] font-medium text-background/90">
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-300 opacity-75"></span>
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400"></span>
                                    </span>
                                    Online
                                </span>
                            </div>
                            <div className="text-xs text-background/80">Services, pricing, booking</div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            aria-label="Close chat"
                            className="-mr-2 flex h-10 w-10 items-center justify-center text-background/80 hover:text-background"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div
                        ref={scrollRef}
                        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 space-y-4"
                    >
                        {messages.length === 0 && (
                            <div className="text-sm text-muted-foreground space-y-3">
                                <p>Ask about our services, pricing, booking, or service areas.</p>
                                <p className="text-xs">Examples: <span className="italic">&ldquo;How much for a 2-bedroom deep clean?&rdquo;</span> · <span className="italic">&ldquo;Do you serve Capitol Hill?&rdquo;</span></p>
                            </div>
                        )}
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[85%] break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
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
                    <form
                        onSubmit={send}
                        className="shrink-0 border-t border-border px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:pb-3"
                    >
                        {locked ? (
                            <div className="text-center py-2 text-xs text-muted-foreground">
                                Chat session ended. For booking text (206) 641-4739 or visit{" "}
                                <a href="/book" className="underline">cleenly.app/book</a>.
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT))}
                                    placeholder="Ask about CLEENLY"
                                    enterKeyHint="send"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    /* 16px on mobile — anything smaller makes iOS Safari
                                       zoom in on focus and push the field off-screen. */
                                    className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-base md:text-sm focus:border-foreground focus:outline-none"
                                    maxLength={MAX_INPUT}
                                />
                                <button
                                    type="submit"
                                    disabled={streaming || !input.trim()}
                                    aria-label="Send"
                                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-foreground text-background disabled:opacity-30 hover:bg-foreground/90 transition-colors"
                                >
                                    {streaming ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            )}
        </>
    );
}
