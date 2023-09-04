import express from "express";
import { handleJoin, handleLogin } from "../controllers/userController";
import {
  handleNewStory,
  handleTrendStory,
} from "../controllers/storyControllers";

import { home } from "../controllers/videoController";

const globalRouter = express.Router("/");

globalRouter.get("/", home);
globalRouter.get("/trending", handleTrendStory);
globalRouter.get("/new", handleNewStory);
globalRouter.get("/login", handleLogin);
globalRouter.get("/join", handleJoin);

export default globalRouter;
