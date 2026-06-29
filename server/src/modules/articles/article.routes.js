import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/rbac.middleware.js";
import {
  create,
  getArticles,
  getBySlug,
  getArticleById,
  listPublished,
  publish,
  remove,
  update,
  myArticles,
  submit,
  pendingArticles,
  reject,
  getMyArticleById,
  updateMyArticle,
  getStats,
  getMyStats,
  recordView,
} from "./article.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createArticleSchema } from "./article.validation.js";

const router = Router();
/* Public */
router.get("/", listPublished);

/* User */
router.get("/my", authenticate, authorize("USER", "EDITOR", "ADMIN"), myArticles);
router.get("/my/stats", authenticate, getMyStats);
router.get("/my/:id", authenticate, authorize("USER", "EDITOR", "ADMIN"), getMyArticleById);

router.patch("/my/:id", authenticate, authorize("USER", "EDITOR", "ADMIN"), updateMyArticle);
router.patch("/:id/submit", authenticate, authorize("USER", "EDITOR", "ADMIN"), submit);

/* Admin / Editor */
router.get("/all", authenticate, authorize("ADMIN", "EDITOR"), getArticles);
router.get("/id/:id", authenticate, authorize("ADMIN", "EDITOR"), getArticleById);

/* Admin */
router.get("/stats", authenticate, authorize("ADMIN"), getStats);
router.get("/pending", authenticate, authorize("ADMIN"), pendingArticles);

router.patch("/:id/publish", authenticate, authorize("ADMIN"), publish);
router.patch("/:id/reject", authenticate, authorize("ADMIN"), reject);
/* User */
router.delete("/my/:id", authenticate, authorize("USER", "EDITOR", "ADMIN"), remove);

/* Admin */
router.delete("/:id", authenticate, authorize("ADMIN"), remove);

/* Protected writes */
router.post("/", authenticate, authorize("USER", "EDITOR", "ADMIN"), validate(createArticleSchema), create);
router.patch("/:id", authenticate, authorize("ADMIN", "EDITOR"), update);

router.post("/:slug/view", recordView);

/* Public slug route - ALWAYS LAST */
router.get("/:slug", getBySlug);

export default router;