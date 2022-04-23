const express = require("express");
const start = require("./exercise_mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require(__dirname + "/exercise_mongodb.js");
const app = express();

app.set("view engine", "ejs");
app.use(cors());
app.use(bodyParser.json());

app.get("/", function (req, res) {
  async function start() {
    // FETCH THE DATA FROM THE DATABASE
    let data = await db("Fetch", "Exercise");

    // PREPARE CONTAINERS
    dates = [];
    counters = [];
    exercise = "Punch";

    console.log(data);

    // PUT DATA TO CONTAINERS
    data.forEach((value) => {
      dates.push(value.date);
      counters.push(value.counter);
    });

    const datasets = [...new Set(data.map((x) => x.exercise))].map(
      (exerciseName) => {
        const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        return {
          data: data
            .filter((x) => x.exercise === exerciseName)
            .map((y) => ({ x: y.date, y: y.counter })),
          borderColor: color,
          backgroundColor: color,
          label: exerciseName,
        };
      }
    );

    console.log(datasets[0].data[0]);

    // PASS THE DATA TO HTML/EJS FILE
    res.render("main.ejs", {
      exercise: exercise,
      date: dates,
      counter: counters,
      datasets,
    });
  }
  start();
});

app.post("/exercise", async (req, res) => {
  console.log(req);
  await start("Exercise", req.body);
  res.send("saved!");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Listening to http://localhost:${PORT}`));

// To run:
// nodemon index.js
