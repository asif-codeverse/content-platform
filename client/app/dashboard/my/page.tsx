"use client";

import { getMyArticles, submitArticle } from "@/services/article.service";
import { useEffect, useRef, useState } from "react";
import StatusBadge from "@/components/StatusBadge";
import { useRouter } from "next/navigation";
import type { Article } from "@/types/article";

export default function MyArticlesPage() {
    const router = useRouter();

    const [articles, setArticles] = useState<Article[]>([]);

    const [loading, setLoading] = useState(true);
    const [submittingId, setSubmittingId] = useState<string | null>(null);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [activeReviewArticleId, setActiveReviewArticleId] =
        useState<string | null>(null);
    const [reviewMessage, setReviewMessage] = useState("");

    const messageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const loadArticles = async () => {
            try {
                const data = await getMyArticles();

                setArticles(data);
            } catch {
                setError("Failed to load your articles.");
            } finally {
                setLoading(false);
            }
        };

        loadArticles();
    }, []);

    useEffect(() => {
        return () => {
            if (messageTimeoutRef.current) {
                clearTimeout(messageTimeoutRef.current);
            }
        };
    }, []);

    const closeReview = () => {
        setActiveReviewArticleId(null);
        setReviewMessage("");
    };

    const editArticle = (id: string) => {
        router.push(`/dashboard/edit/${id}`);
    };

    const viewArticle = (slug: string) => {
        router.push(`/articles/${slug}`);
    };

    const handleSubmit = async (id: string) => {
        setError("");
        setMessage("");
        setSubmittingId(id);

        try {
            await submitArticle(id, reviewMessage);


            setArticles((prev) =>
                prev.map((article) =>
                    article._id === id
                        ? { ...article, status: "PENDING" }
                        : article
                )
            );

            setError("");
            setMessage("Article submitted for review successfully.");
            closeReview();

            if (messageTimeoutRef.current) {
                clearTimeout(messageTimeoutRef.current);
            }
            messageTimeoutRef.current = setTimeout(() => {
                setMessage("");
            }, 3000);
        } catch (err) {
            const apiError = err as { response?: { data?: { message?: string } } };
            setError(
                apiError.response?.data?.message || "Failed to submit article."
            );

            if (process.env.NODE_ENV === "development") {
                console.error(err);
            }
        } finally {
            setSubmittingId(null);
        }
    };

    if (loading) {
        return (
            <main className="p-8">
                <p>Loading articles...</p>
            </main>
        );
    }

    if (articles.length === 0) {
        return (
            <main className="p-8">
                <h1 className="text-3xl font-bold">My Articles</h1>
                <p className="mt-6">No articles yet.</p>
                <p className="text-gray-500">
                    Start writing your first article to see it here.
                </p>
            </main>
        );
    }

    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold mb-6">My Articles</h1>

            {message && <p className="text-green-600 mb-4">{message}</p>}
            {error && <p className="text-red-600 mb-4">{error}</p>}

            {articles.map((article) => {

                const canSubmit =
                    article.status === "DRAFT" || article.status === "REJECTED";

                const submitLabel =
                    article.status === "REJECTED" ? "Submit Again" : "Submit";

                const formattedDate = new Date(article.createdAt).toLocaleDateString(
                    "en-IN",
                    { day: "numeric", month: "short", year: "numeric" }
                );

                const isSubmittingThisArticle = submittingId === article._id;

                const isAnySubmissionInProgress = submittingId !== null;

                const reviewMessageFieldId = `review-message-${article._id}`;

                return (
                    <div key={article._id} className="border rounded p-4 mb-4">
                        <h2 className="text-xl font-semibold">{article.title}</h2>

                        <p className="mt-2">
                            <StatusBadge status={article.status} />
                        </p>

                        <p className="text-sm text-gray-500">
                            Created: {formattedDate}
                        </p>

                        <div className="flex gap-3 mt-4">
                            {canSubmit && (
                                <>
                                    <button
                                        type="button"
                                        className="text-blue-600"
                                        disabled={isSubmittingThisArticle}
                                        onClick={() => editArticle(article._id)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        className="text-green-600"
                                        disabled={isAnySubmissionInProgress}
                                        onClick={() => {
                                            setActiveReviewArticleId(article._id);
                                            setReviewMessage("");
                                        }}
                                    >
                                        {submitLabel}
                                    </button>
                                </>
                            )}

                            {article.status === "PENDING" && (
                                <p>Waiting for Admin Review</p>
                            )}

                            {article.status === "PUBLISHED" && (
                                <button
                                    type="button"
                                    className="text-indigo-600"
                                    onClick={() => viewArticle(article.slug)}
                                >
                                    View
                                </button>
                            )}
                        </div>

                        {canSubmit && activeReviewArticleId === article._id && (
                            <div className="mt-4 border rounded p-4">
                                <label
                                    htmlFor={reviewMessageFieldId}
                                    className="font-semibold"
                                >
                                    Message to Admin
                                </label>
                                <p className="text-sm text-gray-500 mt-1">
                                    Optional. Include anything you want the reviewer to know.
                                </p>

                                <textarea
                                    id={reviewMessageFieldId}
                                    value={reviewMessage}
                                    onChange={(e) => setReviewMessage(e.target.value)}
                                    rows={4}
                                    placeholder="Write a message..."
                                    className="w-full border rounded p-3 mt-3"
                                ></textarea>

                                <div className="flex gap-3 mt-4">
                                    <button
                                        type="button"
                                        className="text-gray-600"
                                        disabled={isAnySubmissionInProgress}
                                        onClick={closeReview}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        className="text-green-600"
                                        disabled={isAnySubmissionInProgress}
                                        onClick={() => handleSubmit(article._id)}
                                    >
                                        {submitLabel}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </main>
    );
}