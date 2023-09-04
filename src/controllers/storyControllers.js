const stories = [
  {
    title: "aaa",
    rating: "5",
    comments: 2,
    createAt: "2 min ago",
    views: "14",
    id: 1,
  },
  {
    title: "bbb",
    rating: "3",
    comments: 2,
    createAt: "5 min ago",
    views: "2",
    id: 2,
  },
  {
    title: "ccc",
    rating: "7",
    comments: 2,
    createAt: "10 min ago",
    views: "1",
    id: 3,
  },
];

export const handleTrendStory = (req, res) => {
  res.render("trend", { pageTitle: "Trend" });
};
export const handleNewStory = (req, res) => {
  res.render("new", { pageTitle: "New Story" });
};
