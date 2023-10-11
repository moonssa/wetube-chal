import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
import Video from "../models/Video";

export const retrieveAllUsers = (req, res) => res.send("<h1> Users Page </h1>");

export const retrieveProfile = async (req, res) => {
  const { id } = req.params;
  console.log(req);
  const user = await User.findById(id).populate("videos");
  console.log(user);
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User not found" });
  }
  // const videos = await Video.find({ owner: user._id });

  return res.render("users/profile", {
    pageTitle: user.name,
    user,
    // videos,
  });
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
  const user = await User.findOne({ username, socialOnly: false });
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
  req.session.user = null;
  req.session.loggedIn = false;
  req.flash("info", "로그아웃 되었습니다.");
  return res.redirect("/");
  /*
  req.session.destroy((error) => {
    if (error) {
      console.log("Error destry session", error);
    }
    return res.redirect("/");
  });
  */
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
    }

    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        name: userData.name,
        avatarUrl: userData.avatar_url,
        email: emailObj.email,
        username: userData.login,
        password: "",
        location: userData.location,
        socialOnly: true,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
    // return res.render("home");
  } else {
    // rendering 을 하면  http://localhost:3000/users/github/finish?code=224882c4b476cb6fae5c  이와같이 URL이 노출
    // return res.render("login");
    return res.redirect("/login");
  }
  // return res.send(JSON.stringify(json));
};

export const startNaverLogin = (req, res) => {
  const baseUrl = "https://nid.naver.com/oauth2.0/authorize?";
  const redirectURI = encodeURI("http://localhost:3000/users/naver/finish");

  const config = {
    client_id: process.env.NAVER_CLIENT,
    redirect_uri: redirectURI,
    response_type: "code",
    state: "state_string",
  };

  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}${params}`;
  console.log(finalUrl);
  return res.redirect(finalUrl);
};

export const finishNaverLogin = async (req, res) => {
  console.log(req.query);
  const { code, state } = req.query;
  const redirectURI = encodeURI("http://localhost:3000/users/naver/finish");
  const baseUrl = "https://nid.naver.com/oauth2.0/token";
  const config = {
    grant_type: "authorization_code",
    client_id: process.env.NAVER_CLIENT,
    client_secret: process.env.NAVER_SECRET,
    redirect_uri: redirectURI,
    code: code,
    state: state,
  };

  const params = new URLSearchParams(config);
  const finalUrl = `${baseUrl}?${params}`;
  console.log(finalUrl);

  const tokenReq = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        "X-Naver-Client-Id": config.client_id,
        "X-Naver-Client-Secret": config.client_secret,
      },
    })
  ).json();

  console.log(tokenReq);
  if ("access_token" in tokenReq) {
    const { access_token } = tokenReq;
    const apiUrl = "https://openapi.naver.com/v1/nid/me";

    const userData = await (
      await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();
    console.log(userData);

    const { email, name } = userData.response;
    let user = await User.findOne({ email: email });
    if (!user) {
      user = await User.create({
        name: name,
        // avatarUrl: userData.avatar_url,
        email: email,
        username: name,
        password: "",
        // location: userData.location,
        socialOnly: true,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
    // return res.render("home");
  } else {
    // rendering 을 하면  http://localhost:3000/users/github/finish?code=224882c4b476cb6fae5c  이와같이 URL이 노출
    // return res.render("login");
    return res.redirect("/login");
  }
  // return res.send(JSON.stringify(json));
};

export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit profile" });
};
/*
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { name, email, username, location },
  } = req;

 

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { name, email, username, location },
    { new: true },
  );
  req.session.user = updatedUser;

  return res.redirect("/users/edit");
};
*/

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl, email: sessionEmail, username: sessionUsername },
    },
    body: { name, email, username, location },
    file,
  } = req;

  console.log("*****", file);

  if (sessionEmail !== email || sessionUsername !== username) {
    const exists = await User.exists({
      $or: [{ username }, { email }],
      $and: [{ _id: { $ne: _id } }],
    });
    if (exists) {
      return res.status(400).render("edit-profile", {
        pageTitle: "Edit profile",
        errorMessage: "입력하신 이메일, 유저네임 사용자가 이미 존재합니다.",
      });
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.path : avatarUrl,
      name,
      email,
      username,
      location,
    },
    { new: true },
  );
  req.session.user = updatedUser;

  return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    return res.redirect("/");
  }
  return res.render("users/change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPasswordConfirm },
  } = req;

  const user = await User.findById({ _id });
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "로그인 패스워드가 일치하지 않습니다.",
    });
  }

  if (newPassword !== newPasswordConfirm) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: " 새로운 패스워드가 일치하지 않습니다.",
    });
  }

  user.password = newPassword;
  await user.save();
  req.flash("info", "패스워드가 수정되었습니다");
  return res.redirect("/users/logout");
};
