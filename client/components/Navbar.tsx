"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { logoutUser } from "@/services/auth.service";

import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ThemeToggle";
import SearchBar from "./SearchBar";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();

    const { user, logout } = useAuth();
    const isLoggedIn = !!user;

    const handleLogout = async () => {
        try {
            await logoutUser();
        } finally {
            localStorage.removeItem("accessToken");
            logout();
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
                    px-6
                    items-center
                    justify-between
                "
            >
                {/* Left Side: Logo */}
                <div className="flex items-center min-w-[200px]">
                    <Link
                        href="/"
                        className="
                            text-[var(--foreground)]
                            text-[15px]
                            font-semibold
                            tracking-tight
                            transition-opacity
                            hover:opacity-70
                        "
                    >
                        Content Platform
                    </Link>
                </div>

                {/* Center: Search */}
                <div className="flex-1 max-w-lg px-4 flex justify-center">
                    <SearchBar />
                </div>

                {/* Right Side: Navigation & Auth */}
                <nav
                    className="
                        flex
                        items-center
                        gap-6
                        min-w-[200px]
                        justify-end
                    "
                >
                    <div className="flex items-center gap-5 hidden md:flex">
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
            </div>
        </header>
    );
}