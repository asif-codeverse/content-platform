import { api } from "@/lib/api";

export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const updateUserRole = async (
  userId: string,
  role: string
) => {
  const response = await api.patch(
    `/users/${userId}/role`,
    { role }
  );

  return response.data;
};