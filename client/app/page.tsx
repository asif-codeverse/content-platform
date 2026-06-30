import Link from "next/link";
import {
    ArrowRight,
    FileText,
    Search,
    LayoutDashboard,
} from "lucide-react";

import Button from "@/components/ui/Button";

export default function HomePage() {
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
                    Production Ready CMS Platform
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
                    Modern Content
                    <br />
                    Publishing Platform
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
                    Create, manage, review and publish articles with
                    a beautifully minimal editorial workflow built using Next.js,
                    Express, MongoDB, and Redis.
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

                    <Link href="/dashboard">
                        <Button variant="secondary" size="lg" className="w-full sm:w-auto rounded-full px-8 bg-transparent hover:bg-[var(--surface-secondary)] shadow-none">
                            Dashboard
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
                        Rich Article Editor
                    </h2>

                    <p
                        className="
                            mt-3
                            text-[15px]
                            leading-relaxed
                            text-[var(--muted-foreground)]
                        "
                    >
                        Create beautiful articles with a modern rich
                        text editor and structured publishing workflow designed for professionals.
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
                        Fast Search
                    </h2>

                    <p
                        className="
                            mt-3
                            text-[15px]
                            leading-relaxed
                            text-[var(--muted-foreground)]
                        "
                    >
                        Discover articles instantly with optimized
                        search mechanics and a seamless, distraction-free reading experience.
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
                        Editorial Dashboard
                    </h2>

                    <p
                        className="
                            mt-3
                            text-[15px]
                            leading-relaxed
                            text-[var(--muted-foreground)]
                        "
                    >
                        Manage articles, permissions, user reviews and publishing
                        stages from one unified, premium dashboard.
                    </p>
                </div>
            </section>
        </main>
    );
}