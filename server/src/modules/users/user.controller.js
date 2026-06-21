import { getAllUsers, updateUserRole, } from "./user.service.js";

export const getUsersController = async (req, res, next) => {
    try {
        const users = await getAllUsers();
        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

export const updateUserRoleController = async (req, res, next) => {
    try {
        const user = await updateUserRole(req.params.id, req.body.role);

        res.status(200).json({
            success: true,
            message: "Role updated successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

