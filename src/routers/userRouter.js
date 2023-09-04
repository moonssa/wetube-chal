import express from "express";

import {
  retrieveAllUsers,
  retrieveUser,
  editProfile,
} from "../controllers/userController";

const userRouter = express.Router("/users");

userRouter.get("/", retrieveAllUsers);
userRouter.get("/:id([0-9a-f]{24})", retrieveUser);
userRouter.get("/:id([0-9a-f]{24})/edit-profile", editProfile);

export default userRouter;
