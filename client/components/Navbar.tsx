"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, User } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { logoutUser } from "@/services/auth.service";

import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ThemeToggle";
import SearchBar from "./SearchBar";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { user, logout } = useAuth();
    const isLoggedIn = !!user;

    const handleLogout = async () => {
        try {
            await logoutUser();
        } finally {
            localStorage.removeItem("accessToken");
            logout();
            setIsMobileMenuOpen(false);
            router.push("/");
        }
    };

    const navItemClass = (href: string) =>
        `
            text-[14px]
            font-medium
            transition-colors
            duration-200
            hover:text-[var(--foreground)]
            ${pathname === href
            ? "text-[var(--foreground)]"
            : "text-[var(--muted-foreground)]"
        }
        `;

    return (
        <header
            className="
                sticky
                top-0
                z-50
                w-full
                border-b
                border-[var(--border)]
                bg-[var(--background)]/70
                backdrop-blur-xl
                supports-[backdrop-filter]:bg-[var(--background)]/60
            "
        >
            <div
                className="
                    flex
                    h-16
                    w-full
                    px-4
                    md:px-6
                    items-center
                    justify-between
                "
            >
                {/* Left Side: Logo */}
                <div className="flex items-center min-w-0 md:min-w-[200px]">
                    <Link
                        href="/"
                        className="
                            text-[var(--foreground)]
                            text-[15px]
                            font-semibold
                            tracking-tight
                            transition-opacity
                            hover:opacity-70
                            truncate
                        "
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Content Platform
                    </Link>
                </div>

                {/* Center: Search (Desktop) */}
                <div className="flex-1 max-w-lg px-4 hidden md:flex justify-center">
                    <SearchBar />
                </div>

                {/* Right Side: Navigation & Auth (Desktop) */}
                <nav
                    className="
                        hidden
                        md:flex
                        items-center
                        gap-6
                        min-w-[200px]
                        justify-end
                    "
                >
                    <div className="flex items-center gap-5">
                        <Link href="/articles" className={navItemClass("/articles")}>
                            Articles
                        </Link>

                        {isLoggedIn && (
                            <Link href="/dashboard" className={navItemClass("/dashboard")}>
                                Dashboard
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {!isLoggedIn ? (
                            <>
                                <Link
                                    href="/login"
                                    className="
                                        text-[14px]
                                        font-medium
                                        text-[var(--muted-foreground)]
                                        hover:text-[var(--foreground)]
                                        transition-colors
                                    "
                                >
                                    Log in
                                </Link>

                                <Link href="/register" className="ml-2">
                                    <Button variant="primary" className="h-8 px-4 py-0 text-[13px] rounded-full font-medium">
                                        Sign up
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="
                                    text-[14px]
                                    font-medium
                                    text-[var(--muted-foreground)]
                                    hover:text-[var(--foreground)]
                                    transition-colors
                                "
                            >
                                Log out
                            </button>
                        )}

                        <div className="ml-2 pl-4 border-l border-[var(--border)] flex items-center h-5">
                            <ThemeToggle />
                        </div>
                    </div>
                </nav>

                {/* Mobile Right Side */}
                <div className="flex md:hidden items-center gap-3">
                    {!isLoggedIn ? (
                        <Link
                            href="/login"
                            className="
                                text-[13px]
                                font-medium
                                text-[var(--foreground)]
                                px-3
                                py-1.5
                                rounded-full
                                border
                                border-[var(--border)]
                                bg-[var(--surface)]
                            "
                        >
                            Log in
                        </Link>
                    ) : (
                        <Link href="/dashboard" className="flex items-center justify-center h-8 w-8 rounded-full bg-[var(--surface-secondary)] border border-[var(--border)] text-[var(--foreground)]">
                            <User size={14} />
                        </Link>
                    )}
                    
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 -mr-2 text-[var(--foreground)]"
                        aria-label="Toggle Menu"
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-[var(--border)] bg-[var(--background)] px-4 py-4 space-y-4 shadow-lg absolute w-full left-0">
                    <div className="mb-4">
                        <SearchBar />
                    </div>
                    <div className="flex flex-col space-y-3">
                        <Link href="/articles" onClick={() => setIsMobileMenuOpen(false)} className={navItemClass("/articles")}>
                            Articles
                        </Link>

                        {isLoggedIn && (
                            <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={navItemClass("/dashboard")}>
                                Dashboard
                            </Link>
                        )}
                    </div>

                    <div className="pt-4 border-t border-[var(--border)] flex flex-col space-y-3">
                        {!isLoggedIn ? (
                            <>
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="
                                        text-[14px]
                                        font-medium
                                        text-[var(--muted-foreground)]
                                    "
                                >
                                    Log in
                                </Link>

                                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="primary" className="w-full h-9 rounded-full font-medium">
                                        Sign up
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="
                                    text-left
                                    text-[14px]
                                    font-medium
                                    text-[var(--muted-foreground)]
                                "
                            >
                                Log out
                            </button>
                        )}
                        
                        <div className="pt-2 flex items-center justify-between">
                            <span className="text-[14px] font-medium text-[var(--muted-foreground)]">Theme</span>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}