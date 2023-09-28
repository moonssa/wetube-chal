import Video from "../models/Video.js";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ createdAt: "desc" });
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
    });
    return res.render("search", { pageTitle: `Search`, videos });
  }

  return res.render("search", { pageTitle: `Search`, videos: [] });
};

export const getUpload = async (req, res) => {
  return res.render("upload", { pageTitle: "Upload", videos: [] });
};

export const postUpload = async (req, res) => {
  const {
    body: { title, description, hashtags },
    file,
  } = req;

  console.log("video dfile", file);
  try {
    await Video.create({
      title,
      description,
      fileUrl: file.path,
      hashtags: Video.formatHashtags(hashtags),
      meta: {
        views: 0,
        rating: 0,
      },
    });
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
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  return res.render("watch", { pageTitle: `${video.title}`, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  return res.render("edit", { pageTitle: `Editing`, video });
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }

  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  await Video.findByIdAndDelete(id);

  return res.redirect("/");
};
