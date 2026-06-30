"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const { theme, resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button
                className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    text-[var(--muted)]
                    transition-colors
                "
                disabled
                aria-hidden="true"
            />
        );
    }

    const isDark = theme === "dark" || resolvedTheme === "dark";

    return (
        <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                text-[var(--muted-foreground)]
                hover:bg-[var(--surface-secondary)]
                hover:text-[var(--foreground)]
                transition-all
                duration-200
                active:scale-95
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[var(--ring)]
            "
            aria-label="Toggle theme"
            title={isDark ? "Switch to light theme" : "Switch to dark theme"}
        >
            {isDark ? (
                <Sun size={18} strokeWidth={2} />
            ) : (
                <Moon size={18} strokeWidth={2} />
            )}
        </button>
    );
}