export const handleHome = (req, res) =>
  res.render("home", { pageTitle: "Home" });

export const handleTrendStory = (req, res) => {
  res.render("trend", { pageTitle: "Trend" });
};
export const handleNewStory = (req, res) => {
  res.render("new", { pageTitle: "New Story" });
};
