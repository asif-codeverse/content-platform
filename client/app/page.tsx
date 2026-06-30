"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { PenSquare } from "lucide-react";
import {
    ArrowRight,
    FileText,
    Search,
    LayoutDashboard,
} from "lucide-react";

import Button from "@/components/ui/Button";

export default function HomePage() {
    const { user } = useAuth();
    return (
        <main className="container-page py-20 md:py-32">
            {/* Hero Section */}
            <section className="mx-auto max-w-4xl text-center flex flex-col items-center">
                <div
                    className="
                        inline-flex
                        items-center
                        rounded-full
                        border
                        border-[var(--border)]
                        bg-[var(--surface-secondary)]/50
                        px-3
                        py-1
                        text-xs
                        font-medium
                        text-[var(--muted-foreground)]
                        mb-8
                    "
                >
                    <span className="flex h-2 w-2 rounded-full bg-[var(--accent)] mr-2" />
                    Trusted by Writers & Readers
                </div>

                <h1
                    className="
                        text-5xl
                        md:text-7xl
                        font-bold
                        tracking-tighter
                        text-[var(--foreground)]
                        leading-[1.1]
                    "
                >
                    Publish Stories.
                    <br />
                    Share Knowledge.
                </h1>

                <p
                    className="
                        mt-8
                        max-w-2xl
                        text-lg
                        md:text-xl
                        text-[var(--muted-foreground)]
                        leading-relaxed
                    "
                >
                    Write insightful articles, collaborate through editorial review,
                    and publish content that reaches readers with a clean, modern
                    publishing experience.
                </p>

                <div
                    className="
                        mt-10
                        flex
                        flex-col
                        sm:flex-row
                        items-center
                        justify-center
                        gap-4
                    "
                >
                    <Link href="/articles">
                        <Button size="lg" className="w-full sm:w-auto rounded-full px-8">
                            <span className="flex items-center gap-2">
                                Explore Articles
                                <ArrowRight size={16} />
                            </span>
                        </Button>
                    </Link>

                    <Link href={user ? "/dashboard/create" : "/login"}>
                        <Button size="lg" className="w-full sm:w-auto rounded-full px-8">
                            <span className="flex items-center gap-2">
                                <PenSquare size={16} />
                                {user ? "Write an Article" : "Login to Write"}
                            </span>
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section
                className="
                    mt-32
                    grid
                    gap-6
                    md:grid-cols-3
                    max-w-6xl
                    mx-auto
                "
            >
                <div
                    className="
                        group
                        rounded-[var(--radius-lg)]
                        border
                        border-[var(--border)]
                        bg-[var(--surface)]
                        p-10
                        shadow-sm
                        transition-all
                        duration-300
                        hover:shadow-[var(--shadow)]
                        hover:-translate-y-1
                        hover:border-[var(--border-strong)]
                    "
                >
                    <div className="h-12 w-12 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] flex items-center justify-center mb-6 text-[var(--foreground)] group-hover:scale-105 transition-transform duration-300">
                        <FileText size={22} strokeWidth={2} />
                    </div>

                    <h2 className="text-[18px] font-semibold tracking-tight text-[var(--foreground)]">
                        Powerful Writing Experience
                    </h2>

                    <p
                        className="
                            mt-3
                            text-[15px]
                            leading-relaxed
                            text-[var(--muted-foreground)]
                        "
                    >
                        Write distraction-free with a rich text editor designed for creating beautifully formatted articles.
                    </p>
                </div>

                <div
                    className="
                        group
                        rounded-[var(--radius-lg)]
                        border
                        border-[var(--border)]
                        bg-[var(--surface)]
                        p-10
                        shadow-sm
                        transition-all
                        duration-300
                        hover:shadow-[var(--shadow)]
                        hover:-translate-y-1
                        hover:border-[var(--border-strong)]
                    "
                >
                    <div className="h-12 w-12 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] flex items-center justify-center mb-6 text-[var(--foreground)] group-hover:scale-105 transition-transform duration-300">
                        <Search size={22} strokeWidth={2} />
                    </div>

                    <h2 className="text-[18px] font-semibold tracking-tight text-[var(--foreground)]">
                        Discover Great Content
                    </h2>

                    <p
                        className="
                            mt-3
                            text-[15px]
                            leading-relaxed
                            text-[var(--muted-foreground)]
                        "
                    >
                        Find articles instantly through fast search and enjoy a smooth, reader-focused browsing experience.
                    </p>
                </div>

                <div
                    className="
                        group
                        rounded-[var(--radius-lg)]
                        border
                        border-[var(--border)]
                        bg-[var(--surface)]
                        p-10
                        shadow-sm
                        transition-all
                        duration-300
                        hover:shadow-[var(--shadow)]
                        hover:-translate-y-1
                        hover:border-[var(--border-strong)]
                    "
                >
                    <div className="h-12 w-12 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] flex items-center justify-center mb-6 text-[var(--foreground)] group-hover:scale-105 transition-transform duration-300">
                        <LayoutDashboard size={22} strokeWidth={2} />
                    </div>

                    <h2 className="text-[18px] font-semibold tracking-tight text-[var(--foreground)]">
                        Editorial Workflow
                    </h2>

                    <p
                        className="
                            mt-3
                            text-[15px]
                            leading-relaxed
                            text-[var(--muted-foreground)]
                        "
                    >
                        Manage drafts, reviews, publishing, and user permissions from a single streamlined workspace.
                    </p>
                </div>
            </section>
        </main>
    );
}