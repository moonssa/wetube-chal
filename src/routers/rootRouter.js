import express from "express";
import {
  getJoin,
  handleLogin,
  login,
  postJoin,
} from "../controllers/userController";
import {
  handleNewStory,
  handleTrendStory,
} from "../controllers/storyControllers";

import { home, search } from "../controllers/videoController";

const rootRouter = express.Router("/");

rootRouter.get("/", home);
rootRouter.get("/search", search);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.get("/trending", handleTrendStory);
rootRouter.get("/new", handleNewStory);
rootRouter.get("/login", login);

export default rootRouter;
