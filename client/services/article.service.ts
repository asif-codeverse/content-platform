import { api } from "@/lib/api";

export const getArticles = async (
  page = 1
) => {

  const response =
    await api.get(
      `/articles?page=${page}`
    );

  return response.data;
};

export const getArticleBySlug = async (
  slug: string
) => {

  const response =
    await api.get(
      `/articles/${slug}`
    );

  return response.data;
};

export const searchArticles = async (
  query: string
) => {

  const response =
    await api.get(
      `/search?q=${query}`
    );

  return response.data;
};