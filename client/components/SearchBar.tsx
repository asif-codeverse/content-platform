"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function SearchBar() {
    const router = useRouter();

    const [query, setQuery] = useState("");

    const [isMac, setIsMac] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isShortcut =
                (e.ctrlKey || e.metaKey) &&
                e.key.toLowerCase() === "k";

            if (!isShortcut) return;

            if (document.activeElement !== inputRef.current) {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        setIsMac(
            /(Mac|iPhone|iPad|iPod)/i.test(navigator.userAgent)
        );
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const trimmed = query.trim();

        if (!trimmed) return;

        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    };

    return (
        <form
            onSubmit={handleSubmit}
            role="search"
            className="
                relative
                w-full
                max-w-[280px]
            "
        >
            <Search
                size={14}
                className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-[var(--muted-foreground)]
                "
                strokeWidth={2}
            />

            <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                aria-label="Search articles"
                className="
                    h-8
                    w-full
                    rounded-[var(--radius-sm)]
                    border
                    border-transparent
                    bg-[var(--surface-secondary)]
                    pl-9
                    pr-3
                    text-[13px]
                    font-medium
                    text-[var(--foreground)]
                    placeholder:text-[var(--muted-foreground)]
                    transition-all
                    duration-200
                    focus:border-[var(--border)]
                    focus:bg-[var(--surface)]
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[var(--ring)]
                    focus:ring-offset-1
                    focus:ring-offset-[var(--background)]
                    hover:bg-[var(--border)]
                "
            />

            {/* Keyboard shortcut hint (visual only) */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:flex items-center gap-1">
                <kbd className="h-4 rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 text-[10px] font-medium text-[var(--muted-foreground)]"> {isMac ? "⌘" : "Ctrl"}</kbd>
                <span className="text-[10px] text-[var(--muted-foreground)]">
                    +
                </span>
                <kbd className="h-4 rounded border border-[var(--border)] bg-[var(--surface)] px-1 text-[10px] font-medium text-[var(--muted-foreground)]">K</kbd>
            </div>
        </form>
    );
}