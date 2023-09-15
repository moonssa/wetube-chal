import express from "express";
import {
  deleteVideo,
  getEdit,
  postEdit,
  watch,
  getUpload,
  postUpload,
} from "../controllers/videoController";
import { protectMiddleware } from "../middleware";

const videoRouter = express.Router("/videos");

videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectMiddleware)
  .get(getEdit)
  .post(postEdit);
videoRouter
  .route("/upload")
  .all(protectMiddleware)
  .get(getUpload)
  .post(postUpload);
videoRouter
  .route("/:id([0-9a-f]{24})/delete")
  .all(protectMiddleware)
  .get(deleteVideo);

export default videoRouter;
