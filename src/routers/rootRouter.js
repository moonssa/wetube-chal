import express from "express";
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
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
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.get("/trending", handleTrendStory);
rootRouter.get("/new", handleNewStory);

export default rootRouter;
