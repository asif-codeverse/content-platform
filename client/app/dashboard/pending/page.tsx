"use client";

import {
    useEffect,
    useState,
} from "react";

import axios from "axios";

import {
    CheckCircle2,
    XCircle,
    CalendarDays,
    User,
} from "lucide-react";

import {
    getPendingArticles,
    publishArticle,
    rejectArticle,
} from "@/services/article.service";

import type { Article } from "@/types/article";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/StatusBadge";

export default function PendingArticlesPage() {
    const [articles, setArticles] =
        useState<Article[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [selectedPublish, setSelectedPublish] =
        useState<string | null>(null);

    const [publishMessage, setPublishMessage] =
        useState("");

    const [selectedReject, setSelectedReject] =
        useState<string | null>(null);

    const [rejectMessage, setRejectMessage] =
        useState("");

    const loadArticles = async () => {
        try {
            setLoading(true);

            const data =
                await getPendingArticles();

            setArticles(data.data);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.message ??
                    "Something went wrong."
                );
            } else {
                setError("Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadArticles();
    }, []);

    const handlePublish = async (
        id: string
    ) => {
        setError("");

        try {
            await publishArticle(
                id,
                publishMessage
            );

            setArticles((prev) =>
                prev.filter(
                    (article) =>
                        article._id !== id
                )
            );

            setSelectedPublish(null);
            setPublishMessage("");
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.message ??
                    "Something went wrong."
                );
            } else {
                setError("Something went wrong.");
            }
        }
    };

    const handleReject = async (
        id: string
    ) => {
        setError("");

        try {
            await rejectArticle(
                id,
                rejectMessage
            );

            setArticles((prev) =>
                prev.filter(
                    (article) =>
                        article._id !== id
                )
            );

            setSelectedReject(null);
            setRejectMessage("");
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.message ??
                    "Something went wrong."
                );
            } else {
                setError("Something went wrong.");
            }
        }
    };

    if (loading) {
        return (
            <LoadingSpinner text="Loading pending articles..." />
        );
    }

    return (
        <div className="space-y-8">
            <PageHeader
                title="Pending Reviews"
                description="Review submitted articles before publishing."
            />

            <Toast
                message={error}
                type="error"
                onClose={() => setError("")}
            />

            {articles.length === 0 && (
                <EmptyState
                    title="No Pending Reviews"
                    description="Everything has been reviewed."
                    icon="🎉"
                />
            )}

            <div className="space-y-6">
                {articles.map((article) => (
                    <article
                        key={article._id}
                        className="
              rounded-[var(--radius-lg)]
              border
              border-[var(--border)]
              bg-[var(--surface)]
              p-6
              shadow-[var(--shadow-sm)]
            "
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-semibold tracking-tight">
                                    {article.title}
                                </h2>

                                <div
                                    className="
                    mt-4
                    flex
                    flex-wrap
                    gap-5
                    text-sm
                    text-[var(--muted)]
                  "
                                >
                                    <span className="flex items-center gap-2">
                                        <User size={16} />
                                        {article.author?.name}
                                    </span>

                                    <span className="flex items-center gap-2">
                                        <CalendarDays size={16} />
                                        {new Date(
                                            article.createdAt
                                        ).toLocaleDateString("en-IN")}
                                    </span>
                                </div>
                            </div>

                            <StatusBadge
                                status={article.status}
                            />
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Button
                                variant="success"
                                onClick={() => {
                                    setSelectedReject(null);
                                    setRejectMessage("");

                                    setSelectedPublish(
                                        article._id
                                    );
                                    setPublishMessage("");
                                }}
                            >
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 size={16} />
                                    Publish
                                </span>
                            </Button>

                            <Button
                                variant="danger"
                                onClick={() => {
                                    setSelectedPublish(null);
                                    setPublishMessage("");

                                    setSelectedReject(
                                        article._id
                                    );
                                    setRejectMessage("");
                                }}
                            >
                                <span className="flex items-center gap-2">
                                    <XCircle size={16} />
                                    Reject
                                </span>
                            </Button>
                        </div>

                        {selectedPublish ===
                            article._id && (
                                <div
                                    className="
                  mt-6
                  rounded-[var(--radius)]
                  border
                  border-[var(--border)]
                  bg-[var(--surface-secondary)]
                  p-5
                "
                                >
                                    <h3 className="font-semibold">
                                        Message to Author
                                    </h3>

                                    <p className="mt-2 text-sm text-[var(--muted)]">
                                        Optional. This message
                                        will be included with the
                                        approval email.
                                    </p>

                                    <textarea
                                        value={publishMessage}
                                        onChange={(e) =>
                                            setPublishMessage(
                                                e.target.value
                                            )
                                        }
                                        rows={4}
                                        placeholder="Write a message..."
                                        className="
                    mt-4
                    w-full
                    rounded-[var(--radius)]
                    border
                    border-[var(--border)]
                    bg-[var(--surface)]
                    p-3
                    outline-none
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100
                  "
                                    />

                                    <div className="mt-5 flex gap-3">
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                setSelectedPublish(
                                                    null
                                                );
                                                setPublishMessage("");
                                            }}
                                        >
                                            Cancel
                                        </Button>

                                        <Button
                                            variant="success"
                                            onClick={() =>
                                                handlePublish(
                                                    article._id
                                                )
                                            }
                                        >
                                            Publish
                                        </Button>
                                    </div>
                                </div>
                            )}

                        {selectedReject ===
                            article._id && (
                                <div
                                    className="
                  mt-6
                  rounded-[var(--radius)]
                  border
                  border-[var(--border)]
                  bg-[var(--surface-secondary)]
                  p-5
                "
                                >
                                    <h3 className="font-semibold">
                                        Reason for Rejection
                                    </h3>

                                    <p className="mt-2 text-sm text-[var(--muted)]">
                                        Optional. This message
                                        will be sent to the author.
                                    </p>

                                    <textarea
                                        value={rejectMessage}
                                        onChange={(e) =>
                                            setRejectMessage(
                                                e.target.value
                                            )
                                        }
                                        rows={4}
                                        placeholder="Write a message..."
                                        className="
                    mt-4
                    w-full
                    rounded-[var(--radius)]
                    border
                    border-[var(--border)]
                    bg-[var(--surface)]
                    p-3
                    outline-none
                    focus:border-red-500
                    focus:ring-4
                    focus:ring-red-100
                  "
                                    />

                                    <div className="mt-5 flex gap-3">
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                setSelectedReject(
                                                    null
                                                );
                                                setRejectMessage("");
                                            }}
                                        >
                                            Cancel
                                        </Button>

                                        <Button
                                            variant="danger"
                                            onClick={() =>
                                                handleReject(
                                                    article._id
                                                )
                                            }
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            )}
                    </article>
                ))}
            </div>
        </div>
    );
}