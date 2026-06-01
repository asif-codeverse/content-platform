export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next({
        statusCode: 401,
        message: "User not authenticated",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next({
        statusCode: 403,
        message: "Forbidden: insufficient rights",
      });
    }

    next();
  };
};