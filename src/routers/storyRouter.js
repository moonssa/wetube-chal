import express from "express";
const storyRouter = express.Router("/stories");

const watchStory = (req, res) => {
  const { id } = req.params;
  return res.send(`<h1>${id} : Watch Story Page </h1>`);
};
const editStory = (req, res) => {
  const { id } = req.params;
  return res.send(`<h1> ${id}: Edit Story Page </h1>`);
};
const deleteStory = (req, res) => {
  const { id } = req.params;
  return res.send(`<h1> ${id}: Delete Story Page </h1>`);
};

storyRouter.get("/:id(\\d+)", watchStory);
storyRouter.get("/:id(\\d+)/edit", editStory);
storyRouter.get("/:id(\\d+)/delete", deleteStory);

export default storyRouter;
