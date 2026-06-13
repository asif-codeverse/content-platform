import { api } from "@/lib/api";

export const searchArticles = async (
  query: string
) => {
  const response = await api.get(
    `/search?q=${query}`
  );

  return response.data;
};