import { api } from "@/lib/api";

export const getDashboardStats = async () => {
    const response = await api.get("/articles/stats");
    return response.data.data;
}