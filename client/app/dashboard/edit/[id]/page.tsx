"use client";
import {
    use,
    useEffect,
    useState,
} from "react";
import { useRouter } from "next/navigation";
import { getMyArticleById, updateMyArticle, } from "@/services/article.service";
import RichTextEditor from "@/components/editor/RichTextEditor";

export default function EditPage({
    params,
}: {
    params: Promise<{
        id: string;
    }>;
}) {
    const router =
        useRouter();

    const { id } = use(params);

    const [title, setTitle] =
        useState("");

    const [content, setContent] =
        useState("");

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

            await updateMyArticle(
                id,
                title,
                content
            );

            alert(
                "Article Updated"
            );

            router.push(
                "/dashboard/my"
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

                <RichTextEditor
                    value={content}
                    onChange={setContent}
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