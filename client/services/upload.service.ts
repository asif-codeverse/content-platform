import { api } from "@/lib/api";

export const uploadImage = async (file: File) => {
    const formData = new FormData();

    formData.append("image", file);

    const response = await api.post(
        "/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data.data;
};