"use client";

import {
    use,
    useEffect,
    useState,
} from "react";
import { useRouter } from "next/navigation";

import RichTextEditor from "@/components/editor/RichTextEditor";
import Toast from "@/components/ui/Toast";
import Button from "@/components/ui/Button";

import {
    getMyArticleById,
    updateMyArticle,
} from "@/services/article.service";

export default function EditPage({
    params,
}: {
    params: Promise<{
        id: string;
    }>;
}) {

    const router =
        useRouter();

    const { id } =
        use(params);

    const [title, setTitle] =
        useState("");

    const [content, setContent] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    useEffect(() => {

        const loadArticle =
            async () => {

                const result =
                    await getMyArticleById(id);

                setTitle(
                    result.data.title
                );

                setContent(
                    result.data.content
                );

            };

        loadArticle();

    }, [id]);

    const handleSubmit =
        async (
            e: React.FormEvent
        ) => {

            e.preventDefault();

            setLoading(true);
            setMessage("");
            setError("");

            try {

                await updateMyArticle(
                    id,
                    title,
                    content
                );

                setMessage(
                    "Article updated successfully."
                );

                setTimeout(() => {

                    router.push(
                        "/dashboard/my"
                    );

                }, 1200);

            } catch {

                setError(
                    "Failed to update article."
                );

            } finally {

                setLoading(false);

            }

        };

    return (

        <main className="p-8">

            <h1 className="text-3xl font-bold mb-6">
                Edit Article
            </h1>

            <Toast
                message={message}
                type="success"
                onClose={() =>
                    setMessage("")
                }
            />

            <Toast
                message={error}
                type="error"
                onClose={() =>
                    setError("")
                }
            />

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
            >

                <input
                    value={title}
                    onChange={(e) =>
                        setTitle(
                            e.target.value
                        )
                    }
                    className="
                        border
                        p-2
                        rounded
                    "
                />

                <RichTextEditor
                    value={content}
                    onChange={setContent}
                />
                <Button
                    type="submit"
                    loading={loading}
                >
                    Update
                </Button>

            </form>

        </main>

    );

}