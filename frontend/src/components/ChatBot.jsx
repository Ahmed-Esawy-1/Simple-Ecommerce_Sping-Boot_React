import { useState, useRef, useEffect, useCallback } from "react";
import { sendChatMessage } from "../api/productApi";

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! How can I help you today?", fromUser: false },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const scrollRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    const sendMessage = useCallback(async () => {
        const trimmed = input.trim();
        if (!trimmed || isLoading) return;

        setMessages((prev) => [...prev, { text: trimmed, fromUser: true }]);
        setInput("");
        setIsLoading(true);
        setError(null);

        try {
            const reply = await sendChatMessage(trimmed);
            setMessages((prev) => [...prev, { text: reply, fromUser: false }]);
        } catch (err) {
            setError("Something went wrong. Please try again.");
            console.error("Chat error:", err);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Floating toggle button */}
            <button
                onClick={() => setIsOpen((v) => !v)}
                aria-label={isOpen ? "Close chat" : "Open chat"}
                className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-paper shadow-lg transition-transform hover:scale-105 active:scale-95 dark:bg-ink-dark dark:text-paper-dark"
            >
                {isOpen ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-6 w-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-6 w-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8-1.5 0-2.91-.32-4.14-.88L3 20l1.05-3.16C3.39 15.7 3 14.4 3 13c0-4.418 4.03-8 9-8s9 3.582 9 7z"
                        />
                    </svg>
                )}
            </button>

            {/* Chat panel */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 flex h-[28rem] w-[22rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-ink/10 bg-paper shadow-2xl dark:border-ink-dark/10 dark:bg-paper-dark">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3 dark:border-ink-dark/10">
                        <span className="font-medium text-ink dark:text-ink-dark">
                            Shop Assistant
                        </span>
                        <button
                            onClick={() => setIsOpen(false)}
                            aria-label="Close chat"
                            className="text-ink/50 hover:text-ink dark:text-ink-dark/50 dark:hover:text-ink-dark"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="h-5 w-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Messages — oldest at top, newest at bottom */}
                    <div
                        ref={scrollRef}
                        className="flex-1 space-y-3 overflow-y-auto px-4 py-3"
                    >
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`flex ${m.fromUser ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                                        m.fromUser
                                            ? "bg-ink text-paper dark:bg-ink-dark dark:text-paper-dark"
                                            : "bg-ink/5 text-ink dark:bg-ink-dark/10 dark:text-ink-dark"
                                    }`}
                                >
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="rounded-2xl bg-ink/5 px-3 py-2 text-sm text-ink/50 dark:bg-ink-dark/10 dark:text-ink-dark/50">
                                    Typing…
                                </div>
                            </div>
                        )}
                        {error && (
                            <p className="text-center text-xs text-red-500">
                                {error}
                            </p>
                        )}
                    </div>

                    {/* Input */}
                    <div className="flex items-end gap-2 border-t border-ink/10 p-3 dark:border-ink-dark/10">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                            placeholder="Type a message…"
                            className="max-h-24 flex-1 resize-none rounded-lg border border-ink/10 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-ink/30 dark:border-ink-dark/10 dark:text-ink-dark dark:focus:border-ink-dark/30"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={isLoading || !input.trim()}
                            className="rounded-lg bg-ink px-3 py-2 text-sm text-paper disabled:opacity-40 dark:bg-ink-dark dark:text-paper-dark"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
