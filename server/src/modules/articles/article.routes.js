import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/rbac.middleware.js";
import {
  create,
  listPublished,
  publish,
  remove,
} from "./article.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createArticleSchema } from "./article.validation.js";


const router = Router();

/* Public */
router.get("/", listPublished);

/* Protected */
router.post(
  "/",
  authenticate,
  authorize("ADMIN", "EDITOR"),
  validate(createArticleSchema),
  create,
);
router.patch("/:id/publish", authenticate, authorize("ADMIN"), publish);
router.delete("/:id", authenticate, authorize("ADMIN"), remove);

export default router;
