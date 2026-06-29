"use client";

import {
    getPendingArticles,
    publishArticle,
    rejectArticle,
} from "@/services/article.service";
import type { Article } from "@/types/article";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import {
    useEffect,
    useState,
} from "react";
import axios from "axios";

export default function PendingArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([]);

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

                setError(
                    "Something went wrong."
                );

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

                setError(
                    "Something went wrong."
                );

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
                    article => article._id !== id
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

                setError(
                    "Something went wrong."
                );

            }

        }

    };

    if (loading) return (
        <LoadingSpinner
            text="Loading pending articles..."
        />
    );

    if (error)
        return (
            <p className="text-red-500">
                {error}
            </p>
        );

    return (
        <main className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">
                Pending Articles
            </h1>

            {articles.length === 0 && (
                <EmptyState
                    icon="🎉"
                    title="No Pending Reviews"
                    description="Everything has been reviewed."
                />
            )}

            {articles.map((article) => (
                <div
                    key={article._id}
                    className="border rounded-lg p-5 mb-5"
                >
                    <h2 className="text-xl font-semibold">
                        {article.title}
                    </h2>

                    <p className="mt-2">
                        <strong>Author:</strong>{" "}
                        {article.author?.name}
                    </p>

                    <p>
                        <strong>Status:</strong>{" "}
                        {article.status}
                    </p>

                    <p>
                        <strong>Created:</strong>{" "}
                        {new Date(
                            article.createdAt
                        ).toLocaleDateString()}
                    </p>

                    <div className="mt-4">
                        <div className="flex gap-3">
                            <button
                                onClick={() => {

                                    setSelectedReject(null);
                                    setRejectMessage("");

                                    setSelectedPublish(article._id);
                                    setPublishMessage("");

                                }}
                            >
                                Publish
                            </button>

                            <button
                                onClick={() => {

                                    setSelectedPublish(null);
                                    setPublishMessage("");

                                    setSelectedReject(article._id);
                                    setRejectMessage("");

                                }}
                            >
                                Reject
                            </button>


                        </div>

                        <div>
                            {
                                selectedPublish === article._id && (

                                    <div className="mt-4 border rounded p-4">

                                        <h3 className="font-semibold">
                                            Message to Author
                                        </h3>

                                        <p className="text-sm text-gray-500 mt-1">
                                            Optional. The author will receive this message by email.
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
                    w-full
                    border
                    rounded
                    p-2
                    mt-3
                "
                                        />

                                        <div className="flex gap-3 mt-4">

                                            <button
                                                type="button"
                                                onClick={() => {

                                                    setSelectedPublish(null);
                                                    setPublishMessage("");

                                                }}
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handlePublish(
                                                        article._id
                                                    )
                                                }
                                            >
                                                Publish
                                            </button>

                                        </div>

                                    </div>

                                )
                            }


                            {
                                selectedReject === article._id && (

                                    <div className="mt-4 border rounded p-4">

                                        <h3 className="font-semibold">
                                            Reason for rejection
                                        </h3>

                                        <p className="text-sm text-gray-500 mt-1">
                                            Optional. The author will receive this message by email.
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
                    w-full
                    border
                    rounded
                    p-2
                    mt-3
                "
                                        />

                                        <div className="flex gap-3 mt-4">

                                            <button
                                                type="button"
                                                onClick={() => {

                                                    setSelectedReject(null);
                                                    setRejectMessage("");

                                                }}
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleReject(
                                                        article._id
                                                    )
                                                }
                                            >
                                                Reject
                                            </button>

                                        </div>

                                    </div>

                                )
                            }
                        </div>

                    </div>
                </div>
            ))}
        </main>
    );
}