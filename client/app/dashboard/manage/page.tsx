"use client";

import {
    useEffect,
    useState,
} from "react";
import Link from "next/link";
import type { Article } from "@/types/article";
import Button from "@/components/ui/Button";

import {
    getAdminArticles,
    publishArticle,
    deleteArticle,
} from "@/services/admin.service";

export default function ManagePage() {

    const [articles, setArticles] =
        useState<Article[]>([]);

    const loadArticles =
        async () => {

            try {
                const data =
                    await getAdminArticles();
                setArticles(data.data);
            } finally { }
        };

    useEffect(() => {
        loadArticles();
    }, []);

    const handlePublish =
        async (id: string) => {

            await publishArticle(id);

            loadArticles();
        };

    const handleDelete =
        async (id: string) => {

            await deleteArticle(id);

            loadArticles();
        };

    return (
        <main className="p-8">

            <h1 className="text-3xl font-bold mb-6">
                Manage Articles
            </h1>

            <div className="flex flex-col gap-4">

                {articles.map(
                    (article) => (

                        <div
                            key={article._id}
                            className="
                border
                p-4
                rounded
              "
                        >

                            <h2 className="font-bold">
                                {article.title}
                            </h2>

                            <p>
                                Status:
                                {" "}
                                {article.status}
                            </p>

                            <div className="flex gap-3 mt-3">

                                {
                                    article.status === "DRAFT" && (<Button
                                        onClick={() => handlePublish(article._id)}
                                    >
                                        Publish
                                    </Button>)}

                                <Link
                                    href={`/dashboard/edit/${article._id}`}
                                >
                                    <Button>
                                        Edit
                                    </Button>
                                </Link>

                                <Button
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={() => handleDelete(article._id)}
                                >
                                    Delete
                                </Button>

                            </div>

                        </div>
                    )
                )}

            </div>

        </main>
    );
}