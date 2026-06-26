import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadImage } from "./upload.service.js";

export const upload = asyncHandler(async (req, res) => {
    if (!req.file) throw {
        statusCode: 400,
        message: "Image is required",
    };

    const image = await uploadImage(req.file);

    return res.json({
        success: true,
        data: {
            url: image.secure_url,
            publicId: image.public_id,
        },
    });
});