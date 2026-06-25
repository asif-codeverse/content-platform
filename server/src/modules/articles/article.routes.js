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
} from "./article.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createArticleSchema } from "./article.validation.js";

const router = Router();


router.get("/", listPublished);

/* Admin / Editor */
router.get("/all", authenticate, authorize("ADMIN", "EDITOR"), getArticles);
router.get("/id/:id", authenticate, authorize("ADMIN", "EDITOR"), getArticleById
);

router.get(
  "/my",
  authenticate,
  authorize(
    "USER",
    "EDITOR",
    "ADMIN",
  ),
  myArticles,
);
router.patch(
  "/:id/submit",
  authenticate,
  authorize(
    "USER",
    "EDITOR",
    "ADMIN",
  ),
  submit,
);
router.get(
  "/pending",
  authenticate,
  authorize("ADMIN"),
  pendingArticles,
);

/* Public */
router.get("/:slug", getBySlug);

/* Protected writes */
router.post(
  "/",
  authenticate,
  authorize(
    "USER",
    "EDITOR",
    "ADMIN",
  ),
  validate(createArticleSchema),
  create,
);

router.patch("/:id/publish", authenticate, authorize("ADMIN"), publish);
router.patch(
  "/:id/reject",
  authenticate,
  authorize("ADMIN"),
  reject
);
router.delete("/:id", authenticate, authorize("ADMIN"), remove);
router.patch("/:id", authenticate, authorize("ADMIN", "EDITOR"), update);


export default router;
