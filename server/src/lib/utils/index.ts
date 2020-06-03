import { Request } from "express";
import { Database, User } from "../types";

export const authorize = async (req: Request, db: Database): Promise<User|null> => {
  const userId = req.signedCookies.viewer;
  const token = req.get("X-CSRF-TOKEN");

  const viewer = await db.users.findOne({
    _id: userId,
    token
  });

  return viewer;
};
