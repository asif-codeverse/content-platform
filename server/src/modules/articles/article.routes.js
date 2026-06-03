import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/rbac.middleware.js";
import {
  create,
  getArticles,
  getBySlug,
  listPublished,
  publish,
  remove,
  update,
} from "./article.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createArticleSchema } from "./article.validation.js";

const router = Router();


router.get("/", listPublished);

/* Admin / Editor */
router.get("/all", authenticate, authorize("ADMIN", "EDITOR"), getArticles);

/* Public */
router.get("/:slug", getBySlug);

/* Protected writes */
router.post(
  "/",
  authenticate,
  authorize("ADMIN", "EDITOR"),
  validate(createArticleSchema),
  create,
);

router.patch("/:id/publish", authenticate, authorize("ADMIN"), publish);
router.delete("/:id", authenticate, authorize("ADMIN"), remove);
router.patch("/:id", authenticate, authorize("ADMIN", "EDITOR"), update);

export default router;
