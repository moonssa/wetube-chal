import express from "express";
import morgan from "morgan";

const PORT = 5000;

const app = express();

const logger = morgan("dev");

const handleLogin = (req, res) => res.send("<h3>Login Page...</h3>");
const handleHome = (req, res) => res.send("<h3> Welcome My Home </h3>");
const handleAbout = (req, res) => res.send("<h3> About Page.. </h3>");
const handleContact = (req, res) => res.send("<h3> Contact us... </h3>");

const urlLogger = (req, res, next) => {
  console.log(`Path:${req.url}`);
  next();
};

const timeLogger = (req, res, next) => {
  const date = new Date();
  console.log(`Time: ${date.toLocaleDateString("ko-KR", { timeZone: "UTC" })}`);
  next();
};

const securityLogger = (req, res, next) => {
  if (req.protocol === "https") {
    console.log("Secure!");
  } else {
    console.log("Insecure!");
  }
  next();
};

const protectedLogger = (req, res, next) => {
  if (req.url === "/protected") {
    return res.send("Forbidden");
  }
  next();
};

const handleProtected = (req, res) => {
  res.send("<h1> This is Private Page.. </h1>");
};
app.use(urlLogger);
app.use(timeLogger);
app.use(securityLogger);
app.use(protectedLogger);
app.use(logger);

app.get("/", handleHome);
app.get("/about", handleAbout);
app.get("/contact", handleContact);
app.get("/login", handleLogin);
app.get("/protected", handleProtected);

const handleListening = () =>
  console.log(`✅ Server lintening on port http://localhost:${PORT}🚀🚀`);

app.listen(PORT, handleListening);
