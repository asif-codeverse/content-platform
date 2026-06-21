import express from "express";

import { authenticate }
from "../../middlewares/auth.middleware.js";

import { authorize }
from "../../middlewares/rbac.middleware.js";

import {
  getUsersController,
  updateUserRoleController,
}
from "./user.controller.js";

const router =
  express.Router();

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  getUsersController
);

router.patch(
  "/:id/role",
  authenticate,
  authorize("ADMIN"),
  updateUserRoleController
);

export default router;