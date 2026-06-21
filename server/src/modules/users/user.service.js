import { User } from "../auth/auth.model.js";

export const getAllUsers = async () => {

  const users = await User.find(
    {},
    {
      password: 0,
      refreshTokenVersion: 0,
    }
  ).sort({
    createdAt: -1,
  });

  return users;
};

export const updateUserRole = async (
  userId,
  role
) => {

  const allowedRoles = [
    "USER",
    "EDITOR",
  ];

  if (
    !allowedRoles.includes(role)
  ) {
    throw {
      statusCode: 400,
      message: "Invalid role",
    };
  }

  const user =
    await User.findById(userId);
  if (user.role === "ADMIN") {
    throw {
      statusCode: 400,
      message: "Admin role cannot be modified",
    };
  }

  if (!user) {
    throw {
      statusCode: 404,
      message: "User not found",
    };
  }

  user.role = role;

  await user.save();

  return user;
};