import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/rbac.middleware.js";
import {
  create,
  listPublished,
  publish,
  remove,
} from "./article.controller.js";

const router = Router();

/* Public */
router.get("/", listPublished);

/* Protected */
router.post("/", authenticate, authorize("ADMIN", "EDITOR"), create);
router.patch("/:id/publish", authenticate, authorize("ADMIN"), publish);
router.delete("/:id", authenticate, authorize("ADMIN"), remove);

export default router;
