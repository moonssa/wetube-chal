import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

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

export const startGithubLogin = (req, res) => {
  //  https://github.com/login/oauth/authorize?client_id=26594457b60fd5ea65a2&allow_signup=false&scope=read:user user:email
  const baseUrl = "https://github.com/login/oauth/authorize?";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}${params}`;
  console.log(finalUrl);
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const { code } = req.query;
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  console.log(finalUrl);

  const token_req = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  // const json = await data.json();
  console.log(token_req);
  if ("access_token" in token_req) {
    const { access_token } = token_req;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();
    console.log(userData);
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();
    console.log(emailData);
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified == true,
    );
    console.log(emailObj);
    if (!emailObj) {
      return res.redirect("/login");
    } else {
      const existingUser = await User.findOne({ email: emailObj.email });
      if (existingUser) {
        req.session.loggedIn = true;
        req.session.user = existingUser;
        return res.redirect("/");
        // return res.render("home");
      } else {
        return res.redirect("/login");
      }
    }
  } else {
    // rendering 을 하면  http://localhost:3000/users/github/finish?code=224882c4b476cb6fae5c  이와같이 URL이 노출
    // return res.render("login");
    return res.redirect("/login");
  }
  // return res.send(JSON.stringify(json));
};
