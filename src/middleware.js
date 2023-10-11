import multer from "multer";
export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "wetube";
  res.locals.loggedInUser = req.session.user || {};

  next();
};

export const protectMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    console.log("????");
    next();
  } else {
    req.flash("error", "로그인 먼저 하십시오.");
    res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "이미 로그인 되어 있습니다.");
    console.log("*******!!!!!");
    return res.redirect("/");
  }
};

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: { fileSize: 5000000 },
});

export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: { fileSize: 100000000 },
});
