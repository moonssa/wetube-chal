import express from "express";
import { handleJoin, handleLogin } from "../controllers/userController";
import {
  handleNewStory,
  handleTrendStory,
  handleHome,
} from "../controllers/storyControllers";

const globalRouter = express.Router("/");

globalRouter.get("/", handleHome);
globalRouter.get("/trending", handleTrendStory);
globalRouter.get("/new", handleNewStory);
globalRouter.get("/login", handleLogin);
globalRouter.get("/join", handleJoin);

export default globalRouter;
