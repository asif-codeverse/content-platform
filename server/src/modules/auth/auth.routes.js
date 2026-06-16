import { Router } from "express";
import { register, login, refresh, logout, me } from "./auth.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/rbac.middleware.js";



const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

router.get(
  "/me",
  authenticate,
  authorize("USER", "EDITOR", "ADMIN"),
  me,
);



export default router;
