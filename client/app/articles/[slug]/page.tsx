import {
    CalendarDays,
    Eye,
    User,
} from "lucide-react";

import EmptyState from "@/components/ui/EmptyState";
import ViewTracker from "@/components/articles/ViewTracker";

type Props = {
    params: Promise<{
        slug: string;
    }>;
};

async function getArticle(slug: string) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/articles/${slug}`,
        {
            cache: "no-store",
        }
    );

    if (!response.ok) {
        return null;
    }

    const data = await response.json();

    return data.data;
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;

    const article = await getArticle(slug);

    if (!article) {
        return {
            title: "Article Not Found",
        };
    }

    const plainText = article.content.replace(/<[^>]+>/g, "");

    return {
        title: article.title,
        description: plainText.slice(0, 150),
        openGraph: {
            title: article.title,
            description: plainText.slice(0, 150),
            type: "article",
        },
    };
}

export default async function ArticlePage({ params }: Props) {
    const { slug } = await params;

    const article = await getArticle(slug);

    if (!article) {
        return (
            <div className="container-page py-20">
                <EmptyState
                    icon="📄"
                    title="Article Not Found"
                    description="The article you're looking for doesn't exist."
                />
            </div>
        );
    }

    return (
        <main className="container-article py-16 md:py-24">
            <ViewTracker slug={slug} />

            <article>
                <header className="mb-12">
                    <h1
                        className="
                            text-4xl
                            md:text-5xl
                            lg:text-[3.5rem]
                            font-bold
                            tracking-tighter
                            leading-[1.15]
                            text-[var(--foreground)]
                        "
                    >
                        {article.title}
                    </h1>

                    <div
                        className="
                            mt-10
                            flex
                            flex-wrap
                            items-center
                            gap-6
                            text-[15px]
                            font-medium
                            text-[var(--muted-foreground)]
                            border-b
                            border-[var(--border)]
                            pb-8
                        "
                    >
                        <div className="flex items-center gap-3 text-[var(--foreground)]">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-secondary)] border border-[var(--border)]">
                                <User size={18} />
                            </div>
                            <span>{article.author?.name ?? "Unknown"}</span>
                        </div>

                        <div className="h-4 w-px bg-[var(--border)] hidden sm:block" />

                        <span className="flex items-center gap-2">
                            <CalendarDays size={16} />
                            {new Date(article.createdAt).toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            })}
                        </span>

                        <div className="h-4 w-px bg-[var(--border)] hidden sm:block" />

                        <span className="flex items-center gap-2">
                            <Eye size={16} />
                            {article.views} Views
                        </span>
                    </div>
                </header>

                <div
                    className="article-content"
                    dangerouslySetInnerHTML={{
                        __html: article.content,
                    }}
                />
            </article>
        </main>
    );
}