import type { Request, Response } from "express";

// @desc: fetch all available users.
// @method: GET
// @query: Optional filtering on normalizedTitle.
// @route /users
export const getUsers = async (req: Request, res: Response) => {
    try {
        const data = [{ id: 1, firstName: "Name", lastName: "Nameson" }];
        return res.status(200).json({ message: "Fetched all users succesfully", data });
    } catch (error) {
        console.error(error);
    }
};
