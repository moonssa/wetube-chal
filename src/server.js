import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";

import storyRouter from "./routers/storyRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import rootRouter from "./routers/rootRouter";
import { localsMiddleware } from "./middleware";

const app = express();

const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }),
  }),
);
/*
//쿠키를 볼 수 있다.

app.use((req, res, next) => {
  console.log(req.headers);
  next();
});
*/
// 저장된 session 볼 수 있다.
app.use((req, res, next) => {
  req.sessionStore.all((error, sessions) => {
    console.log(sessions);
    next();
  });
});

// session test
/*
app.get("/add-one", (req, res, next) => {
  req.session.potato += 1;
  return res.send(`${req.session / id}\n${req.session.potato}`);
});
*/
app.use(localsMiddleware);

app.use("/", rootRouter);
app.use("/stories", storyRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
