import express from "express";
import {
  watchVideo,
  editVideo,
  deleteVideo,
  postEdit,
} from "../controllers/videoController";
const videoRouter = express.Router("/videos");

videoRouter.get("/:id(\\d+)", watchVideo);
videoRouter.route("/:id(\\d+)/edit").get(editVideo).post(postEdit);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);

export default videoRouter;
