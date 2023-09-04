const videos = [
  {
    title: "aaa",
    rating: "5",
    comments: 2,
    createAt: "2 min ago",
    views: 14,
    id: 1,
    genres: ["lopan", "muhyub"],
  },
  {
    title: "bbb",
    rating: "3",
    comments: 2,
    createAt: "5 min ago",
    views: 1,
    id: 2,
    genres: ["love", "muhyub"],
  },
  {
    title: "ccc",
    rating: "7",
    comments: 2,
    createAt: "10 min ago",
    views: 10,
    id: 3,
    genres: ["fantasy", "muhyub"],
  },
];

export const handleHome = (req, res) => {
  res.render("home", { pageTitle: "Home", videos });
};

export const watchVideo = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("watch", { pageTitle: `${video.title}`, video });
};
export const editVideo = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("edit", { pageTitle: `Editing ${video.title}`, video });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const video = videos[id - 1];
  console.log(req.body);
  videos[id - 1].title = title;
  return res.redirect(`/videos/${id}`);
};
export const deleteVideo = (req, res) => {
  const { id } = req.params;
  return res.send(`<h1> ${id}: Delete Video Page </h1>`);
};
