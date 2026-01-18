export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next({ statuCode: 401, message: "User not auhthenticated" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next({
        statuCode: 403,
        message: "Forbidden: insufficient rights",
      });
    }
    next();
  };
};
