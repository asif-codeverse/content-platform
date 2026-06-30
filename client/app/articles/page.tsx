"use client";

import { useEffect, useState } from "react";

import type { Article } from "@/types/article";

import { getArticles } from "@/services/article.service";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";

import PageTransition from "@/components/motion/PageTransition";

import ArticlesHeader from "@/components/articles/ArticlesHeader";
import ArticlesGrid from "@/components/articles/ArticlesGrid";
import Pagination from "@/components/articles/Pagination";

export default function ArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const loadArticles = async () => {
            try {
                setLoading(true);
                const data = await getArticles(page);
                setArticles(data.data);
                setTotalPages(data.meta.totalPages);
            } finally {
                setLoading(false);
            }
        };

        loadArticles();
    }, [page]);

    if (loading) {
        return <LoadingSpinner text="Loading articles..." />;
    }

    return (
        <PageTransition>
            <div className="container-page py-16 space-y-12">
                <ArticlesHeader total={articles.length} />

                {articles.length === 0 ? (
                    <EmptyState
                        title="No Articles Found"
                        description="There are no published articles yet."
                    />
                ) : (
                    <>
                        <ArticlesGrid articles={articles} />

                        <div className="pt-8 border-t border-[var(--border)]">
                            <Pagination
                                page={page}
                                totalPages={totalPages}
                                onPrevious={() => setPage((prev) => Math.max(prev - 1, 1))}
                                onNext={() => setPage((prev) => prev + 1)}
                            />
                        </div>
                    </>
                )}
            </div>
        </PageTransition>
    );
}