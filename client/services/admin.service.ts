import { api } from "@/lib/api";

export const createArticle = async (
    title: string,
    content: string
) => {

    const response =
        await api.post(
            "/articles",
            {
                title,
                content,
            }
        );

    return response.data;
};

export const getAdminArticles =
    async () => {

        const response =
            await api.get(
                "/articles/all"
            );

        return response.data;
    };

export const getArticleById =
    async (id: string) => {

        const response =
            await api.get(
                `/articles/id/${id}`
            );

        return response.data;
    };

export const publishArticle =
    async (id: string) => {

        const response =
            await api.patch(
                `/articles/${id}/publish`
            );

        return response.data;
    };

export const deleteArticle =
    async (id: string) => {

        const response =
            await api.delete(
                `/articles/${id}`
            );

        return response.data;
    };

export const updateArticle =
    async (
        id: string,
        title: string,
        content: string
    ) => {

        const response =
            await api.patch(
                `/articles/${id}`,
                {
                    title,
                    content,
                }
            );

        return response.data;
    };