import express from "express";

import {
  retrieveAllUsers,
  retrieveUser,
  editProfile,
  logout,
  startGithubLogin,
  finishGithubLogin,
  startNaverLogin,
  finishNaverLogin,
  getEdit,
  postEdit,
  getChangePassword,
  postChangePassword,
} from "../controllers/userController";
import {
  protectMiddleware,
  publicOnlyMiddleware,
  uploadFiles,
} from "../middleware";

const userRouter = express.Router("/users");

userRouter.get("/logout", protectMiddleware, logout);
userRouter
  .route("/edit")
  .all(protectMiddleware)
  .get(getEdit)
  .post(uploadFiles.single("avatar"), postEdit);

userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);

userRouter.get("/naver/start", startNaverLogin);
userRouter.get("/naver/finish", finishNaverLogin);

userRouter.get("/", retrieveAllUsers);
userRouter.get("/:id([0-9a-f]{24})", retrieveUser);
userRouter.get("/:id([0-9a-f]{24})/edit-profile", editProfile);

userRouter
  .route("/change-password")
  .all(protectMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);

export default userRouter;
