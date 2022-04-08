const express = require("express");
require("dotenv").config();
const reader = require("./scripts/reader");
const app = express();

app.get("/reader/:direction", async (req, res) => {
  await reader.readData();
  await reader.runWorker(req.params.direction);
  res.send("Scan Done");
});

app.get("/generate-model", (req, res) => {
  require("./scripts/model_generator");
  res.send("Generating Model");
});

app.get("/prototype", (req, res) => {
  require("./scripts/prototype");
});

app.listen(process.env.PORT);
