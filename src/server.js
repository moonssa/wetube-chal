import express from "express";
import morgan from "morgan";

import globalRouter from "./routers/globalRouter";
import storyRouter from "./routers/storyRouter";
import userRouter from "./routers/userRouter";

const PORT = 3000;

const app = express();

const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);

app.use("/", globalRouter);
app.use("/stories", storyRouter);
app.use("/users", userRouter);

const handleListening = () =>
  console.log(`✅ Server lintening on port http://localhost:${PORT}🚀🚀`);

app.listen(PORT, handleListening);
