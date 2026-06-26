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

export const createArticle = async (
  title: string,
  content: string
) => {

  const response = await api.post(
    "/articles",
    {
      title,
      content,
    }
  );

  return response.data;
};

export const updateArticle = async (
  id: string,
  title: string,
  content: string
) => {

  const response = await api.patch(
    `/articles/${id}`,
    {
      title,
      content,
    }
  );

  return response.data;
};

export const getMyArticles = async () => {

  const response =
    await api.get("/articles/my");

  return response.data.data;

};

export const submitArticle =
  async (
    id: string,
    message: string
  ) => {

    const response =
      await api.patch(
        `/articles/${id}/submit`,
        {
          message,
        }
      );

    return response.data;

  };

export const getPendingArticles = async () => {
  const response = await api.get("/articles/pending");
  return response.data;
};

export const publishArticle = async (
  id: string,
  message: string
) => {

  const response =
    await api.patch(
      `/articles/${id}/publish`,
      {
        message,
      }
    );

  return response.data;
};

export const rejectArticle = async (
  id: string,
  message: string
) => {

  const response =
    await api.patch(
      `/articles/${id}/reject`,
      {
        message,
      }
    );

  return response.data;
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post(
    "/upload", formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.data;
};

export const getMyArticleById =
  async (id: string) => {

    const response =
      await api.get(
        `/articles/my/${id}`
      );

    return response.data;
  };

export const updateMyArticle =
  async (
    id: string,
    title: string,
    content: string
  ) => {

    const response =
      await api.patch(
        `/articles/my/${id}`,
        {
          title,
          content,
        }
      );

    return response.data;
  };