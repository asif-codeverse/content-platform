"use client";

import { useEffect } from "react";
import { recordArticleView } from "@/services/article.service";

type Props = {
    slug: string;
};

export default function ViewTracker({
    slug,
}: Props) {
    useEffect(() => {
        recordArticleView(slug)
            .catch(console.error);
    }, [slug]);

    return null;
}