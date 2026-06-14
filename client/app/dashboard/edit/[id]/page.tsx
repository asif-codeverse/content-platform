"use client";
import {
    use,
    useEffect,
    useState,
} from "react";

import {
    getArticleById,
    updateArticle,
} from "@/services/admin.service";

export default function EditPage({
    params,
}: {
    params: Promise<{
        id: string;
    }>;
}) {

    const { id } = use(params);

    const [title, setTitle] =
        useState("");

    const [content, setContent] =
        useState("");

    useEffect(() => {

        const loadArticle =
            async () => {

                const result =
                    await getArticleById(
                        id
                    );

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

            await updateArticle(
                id,
                title,
                content
            );

            alert(
                "Article Updated"
            );
        };

    return (
        <main className="p-8">

            <h1 className="text-3xl font-bold mb-6">
                Edit Article
            </h1>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
            >

                <input
                    value={title}
                    onChange={(e) =>
                        setTitle(e.target.value)
                    }
                    className="
            border
            p-2
            rounded
          "
                />

                <textarea
                    value={content}
                    onChange={(e) =>
                        setContent(e.target.value)
                    }
                    rows={10}
                    className="
            border
            p-2
            rounded
          "
                />

                <button
                    type="submit"
                    className="
            border
            px-4
            py-2
          "
                >
                    Update
                </button>

            </form>

        </main>
    );
}