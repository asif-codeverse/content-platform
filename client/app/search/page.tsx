"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import type { Article } from "@/types/article";

import { searchArticles } from "@/services/article.service";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PageTransition from "@/components/motion/PageTransition";

import SearchHeader from "@/components/search/SearchHeader";
import SearchResults from "@/components/search/SearchResults";
import SearchEmpty from "@/components/search/SearchEmpty";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const [results, setResults] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const runSearch = async () => {
            try {
                setLoading(true);
                const data = await searchArticles(query);
                setResults(data.data);
            } finally {
                setLoading(false);
            }
        };

        runSearch();
    }, [query]);

    if (loading) {
        return (
            <div className="container-page py-20">
                <LoadingSpinner text="Searching articles..." />
            </div>
        );
    }

    return (
        <PageTransition>
            <div className="container-page py-16 md:py-20 space-y-10">
                <SearchHeader query={query} total={results.length} />

                {!query ? (
                    <SearchEmpty query="anything" />
                ) : results.length === 0 ? (
                    <SearchEmpty query={query} />
                ) : (
                    <SearchResults articles={results} />
                )}
            </div>
        </PageTransition>
    );
}