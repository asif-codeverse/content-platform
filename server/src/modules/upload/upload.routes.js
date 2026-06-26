import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/upload.middleware.js";
import { upload as uploadController } from "./upload.controller.js"

const router = Router();

router.post("/", authenticate, upload.single("image"), uploadController);

export default router;