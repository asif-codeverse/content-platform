import { Router } from "express";
import { register, login , refresh} from "./auth.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/rbac.middleware.js";



const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);

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



export default router;
