import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";

import app from "./server";

const PORT = 3000;
const handleListening = () =>
  console.log(`✅ Server lintening on port https://localhost:${PORT}🚀🚀`);

app.listen(PORT, handleListening);
