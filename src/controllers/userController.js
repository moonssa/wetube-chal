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

export const handleLogin = (req, res) => res.send("<h1> Login plaease </h1>");
export const handleJoin = (req, res) => res.send("<h1> Join plaease </h1>");
