import { Router } from "express";
import { register, login } from "./auth.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/rbac.middleware.js";
import { refresh } from "../articles/article.controller.js";



const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get(
  "/me",
  authenticate,
  authorize("USER", "EDITOR", "ADMIN"),
  (req, res) => {
    res.json({
      message: "You are authenticated",
      user: req.user,
    });
  },
);

router.post("/refresh", refresh);

export default router;
