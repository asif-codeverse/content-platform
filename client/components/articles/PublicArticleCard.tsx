"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, Eye } from "lucide-react";

import type { Article } from "@/types/article";

type Props = {
    article: Article;
};

export default function PublicArticleCard({ article }: Props) {
    const createdAt = new Date(article.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const content = article.content ?? "";

    const excerpt = content
        .replace(/<[^>]+>/g, "")
        .slice(0, 180);

    return (
        <Link href={`/articles/${article.slug}`} className="block group">
            <article
                className="
                    rounded-[var(--radius)]
                    border
                    border-[var(--border)]
                    bg-[var(--surface)]
                    p-6
                    md:p-8
                    shadow-[var(--shadow-xs)]
                    transition-all
                    duration-300
                    group-hover:-translate-y-[2px]
                    group-hover:shadow-[var(--shadow)]
                    group-hover:border-[var(--border-strong)]
                    flex
                    flex-col
                    h-full
                "
            >
                <div
                    className="
                        flex
                        flex-wrap
                        gap-4
                        text-[13px]
                        font-medium
                        text-[var(--muted-foreground)]
                        mb-4
                    "
                >
                    <span className="flex items-center gap-1.5">
                        <CalendarDays size={14} />
                        {createdAt}
                    </span>

                    <span className="flex items-center gap-1.5">
                        <Eye size={14} />
                        {article.views} Views
                    </span>
                </div>

                <h2
                    className="
                        text-2xl
                        md:text-3xl
                        font-semibold
                        tracking-tight
                        text-[var(--foreground)]
                        mb-4
                        line-clamp-2
                    "
                >
                    {article.title}
                </h2>

                <p
                    className="
                        leading-relaxed
                        text-[15px]
                        text-[var(--muted-foreground)]
                        mb-8
                        flex-grow
                        line-clamp-3
                    "
                >
                    {excerpt}
                    {content.length > 180 && "..."}
                </p>

                <div
                    className="
                        mt-auto
                        inline-flex
                        items-center
                        gap-2
                        font-medium
                        text-[14px]
                        text-[var(--foreground)]
                        transition-all
                        group-hover:gap-3
                    "
                >
                    Read Article
                    <ArrowRight size={16} />
                </div>
            </article>
        </Link>
    );
}