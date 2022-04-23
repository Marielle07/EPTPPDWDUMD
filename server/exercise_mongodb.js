const mongoose = require("mongoose");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const date = get_current_date(); // AUTOMATIC DATE
dayjs.extend(utc);
// const date = "3-23-2022"; // MANUAL DATE

function get_current_date() {
  let unformatted_date = new Date();
  month = unformatted_date.getMonth();
  day = unformatted_date.getDate();
  year = unformatted_date.getFullYear();

  let date = month + "-" + day + "-" + year;
  return date;
}

const exerciseSchema = new mongoose.Schema({
  date: String,
  exercise: String,
  counter: Number,
});

const postureSchema = new mongoose.Schema({
  date: String,
  time_start: String,
  time_end: String,
  verdict: String,
});

async function databaseConnect() {
  var myPromise = new Promise((resolve) => {
    // ADJUST NALANG UNG URL IF GAGAWA BAGONG DATABASE
    mongoose.connect(
      "mongodb+srv://admin:admin@cluster.lspgo.mongodb.net/main-database?retryWrites=true&w=majority",
      (err) => {
        if (err) {
          console.log("Error!");
        } else {
          resolve("Connected to MongoDB!");
        }
      }
    );
  });
  let data = await myPromise;
  console.log(data);
}

async function saveExercise(exercise, counter) {
  var myPromise = new Promise(async (resolve) => {
    mongoose.pluralize(null);
    const Exercise = mongoose.model("exercises", exerciseSchema);

    const now = dayjs().local().format("M-DD-YYYY");
    const existingExercise = await Exercise.findOne(
      {
        exercise,
        date: now,
      },
      "exercise counter date"
    ).exec();

    if (existingExercise) {
      // Update Exercise
      await Exercise.updateOne(
        { date: now, exercise },
        { counter: existingExercise.counter + counter }
      ).exec();

      resolve("Exercise Updated!");
    } else {
      // Create Exercise
      const _exercise = new Exercise({
        date: now,
        exercise: exercise,
        counter: counter,
      });
      _exercise.save(() => {
        resolve("Exercise Saved!");
      });
    }
  });
  let data = await myPromise;
  console.log(data);
  return data;
}

async function savePosture(time_start, time_end, verdict) {
  var myPromise = new Promise((resolve) => {
    mongoose.pluralize(null);
    const Posture = mongoose.model("postures", postureSchema);

    const _posture = new Posture({
      date: date,
      time_start: time_start,
      time_end: time_end,
      verdict: verdict,
    });
    _posture.save(() => {
      resolve("Posture Saved!");
    });
  });
  let data = await myPromise;
  console.log(data);
  return data;
}

async function fetchData(data) {
  var myPromise = new Promise((resolve) => {
    mongoose.pluralize(null);
    if (data == "Exercise") {
      const Exercise = mongoose.model("exercises", exerciseSchema);
      console.log("Finding...");
      Exercise.find((err, data) => {
        resolve(data);
      });
    }
    if (data == "Posture") {
      const Posture = mongoose.model("postures", postureSchema);
      console.log("Finding...");
      Posture.find((err, data) => {
        resolve(data);
      });
    }
  });
  let _data = await myPromise;
  console.log("Data Fetched!");
  return _data;
}

async function start(type, data) {
  await databaseConnect();
  if (type == "Exercise") {
    await saveExercise(data.exercise, data.counter);
  }
  if (type == "Posture") {
    await savePosture(data.time_start, data.time_end, data.verdict);
  }
  if (type == "Fetch") {
    let _data = await fetchData(data);
    mongoose.connection.close();
    return _data;
  }
  mongoose.connection.close();
}

module.exports = start;

// --- SAMPLE DATA --- \\

// let data1 = {
//     exercise: "Jumping Jack",
//     counter: 20,
// }
// let data2 = {
//     time_start: "4:30 PM",
//     time_end: "5:30 PM",
//     verdict: "Bad"
// }

// --- SAMPLE USAGE --- \\
// const db = require(__dirname + "/exercise_mongodb.js");

// --- INPUTTING ANOTHER DATA --- \\
// db("Exercise",data1);
// db("Posture",data2);

// --- FETCHING DATA --- \\
// async function start(){
//     let data = await db("Fetch","Exercise");
//     console.log(data);
// }
// start();
