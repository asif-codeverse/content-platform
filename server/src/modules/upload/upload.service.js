import cloudinary from "../../config/cloudinary.js";

export const uploadImage = async (file) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
            folder: "content-platform",
        },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        stream.end(file.buffer);
    });
}