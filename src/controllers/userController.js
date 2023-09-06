import { makeConsoleLogger } from "@notionhq/client/build/src/logging";
import User from "../models/User";
import bcrypt from "bcrypt";

export const retrieveAllUsers = (req, res) => res.send("<h1> Users Page </h1>");

export const retrieveUser = (req, res) => {
  const { id } = req.params;
  console.log(req);
  return res.render("retrieve", { pageTitle: `${id} 의 User Page` });
};

export const editProfile = (req, res) => {
  const { id } = req.params;
  return res.send(`<h1> ${id}의 profile page </h1>`);
};

export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).render("login", {
      pageTitle: "Login",
      errorMessage: "잘못된 username 입니다.",
    });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(404).render("login", {
      pageTitle: "Login",
      errorMessage: "비밀번호가 맞지 않습니다.",
    });
  }
  // store session infomation

  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const getJoin = (req, res) =>
  res.render("join", { pageTitle: "Sign Up" });

export const postJoin = async (req, res) => {
  const { name, email, username, password, password2, location } = req.body;
  console.log(name, email, username, password, location);
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle: "Sign Up",
      errorMessage: "입력하신 패스워드가 일치하지 않습니다.",
    });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle: "Sign Up",
      errorMessage: "입력하신 이메일, 유저네임 사용자가 이미 존재합니다.",
    });
  }
  try {
    await User.create({
      name,
      email,
      username,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle: "Sign Up",
      errorMessage: error._errorMessage,
    });
  }
};

export const logout = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.log("Error destry session", error);
    }
    return res.redirect("/");
  });
};
