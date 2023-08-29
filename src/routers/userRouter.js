import express from "express";

import {
  retrieveAllUsers,
  retrieveUser,
  editProfile,
} from "../controllers/userController";

const userRouter = express.Router("/users");

userRouter.get("/", retrieveAllUsers);
userRouter.get("/:id", retrieveUser);
userRouter.get("/:id/edit-profile", editProfile);

export default userRouter;
