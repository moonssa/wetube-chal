import Video from "../models/Video.js";
import User from "../models/User.js";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({})
      .sort({ createdAt: "desc" })
      .populate("owner");
    res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    return res.status(404).render("server-error");
  }
};
export const search = async (req, res) => {
  const { keyword } = req.query;
  if (keyword) {
    const videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    }).populate("owner");
    return res.render("search", { pageTitle: `Search`, videos });
  }

  return res.render("search", { pageTitle: `Search`, videos: [] });
};

export const getUpload = async (req, res) => {
  return res.render("upload", { pageTitle: "Upload", videos: [] });
};

export const postUpload = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { title, description, hashtags },
    files: { video, thumb },
  } = req;

  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: video[0].path,
      thumbUrl: thumb[0].path,
      hashtags: Video.formatHashtags(hashtags),
      owner: _id,
      meta: {
        views: 0,
        rating: 0,
      },
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    req.flash("info", "동영상이 성공적으로 업로드 되었습니다.");
    return res.redirect("/");
  } catch (error) {
    return res.status(404).render("upload", {
      pageTitle: "Upload",
      errorMessage: error._message,
    });
  }
};
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner");
  console.log(video);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  return res.render("watch", { pageTitle: `${video.title}`, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "권한이 없습니다.");
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `Editing`, video });
};
export const postEdit = async (req, res) => {
  const {
    params: { id },
    body: { title, description, hashtags },
    session: {
      user: { _id },
    },
  } = req;

  const video = await Video.exists({ _id: id });

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }

  if (String(video.owner) !== String(_id)) {
    req.flash("error", "권한이 없습니다.");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "성공적으로 업데이트 되었습니다.");
  return res.redirect(`/videos/${id}`);
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;

  const video = await Video.findById(id);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }

  if (String(video.owner) !== String(_id)) {
    req.flash("error", "권한이 없습니다.");
    return res.status(403).redirect("/");
  }

  await Video.findByIdAndDelete(id);
  req.flash("info", "동영상이 성공적으로 제거되었습니다.");
  return res.redirect("/");
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};
