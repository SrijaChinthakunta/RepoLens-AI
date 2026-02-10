const express = require("express");
const cors = require("cors");
require("dotenv").config();

const githubRoutes = require("./routes/github");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/github", githubRoutes);

app.get("/", (req, res) => {
  res.send("RepoLens AI Server Running");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
