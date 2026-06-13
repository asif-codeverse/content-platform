import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const authenticate = (req, res, next) => {
  console.log("AUTH HEADER:");
  console.log(req.headers.authorization);

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next({ statusCode: 401, message: "Access token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);

    // attach user info to request
    req.user = {
      id: payload.userId,
      role: payload.role,
    };

    next();
  } catch (err) {
    next({ statusCode: 401, message: "Invalid or expired access token" });
  }
};
