const tf = require("@tensorflow/tfjs-node");
const fs = require("fs");
const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
const { COM_PORT } = require("./config");
const { Notification } = require("electron");
function network() {
  var trainingData;

  const port = new SerialPort(COM_PORT, {
    baudRate: 9600,
    autoOpen: false,
  });
  const parser = port.pipe(new Readline());

  port.on("open", () => {
    console.log("Opened!");
  });

  port.on("close", () => {
    console.log("Closed!");
  });

  // setup data
  async function loadFile(activityName) {
    const data = JSON.parse(
      fs.readFileSync(`data/${activityName}.json`, "utf8", (err, data) => {
        return data;
      })
    );

    const labels = [...new Set(data.map((x) => x.label))];

    console.log(labels);

    trainingData = tf.tensor2d(data.map((x) => x.activity));
    outputData = tf.tensor2d(
      data.map((x) => [
        x.label === labels[0] ? 1 : 0,
        x.label === labels[1] ? 1 : 0,
      ])
    );

    const model = tf.sequential();

    model.add(
      tf.layers.dense({
        inputShape: [6],
        activation: "sigmoid",
        units: 10,
      })
    );

    model.add(
      tf.layers.dense({
        inputShape: [10],
        activation: "sigmoid",
        units: 2,
      })
    );

    model.add(
      tf.layers.dense({
        activation: "sigmoid",
        units: 2,
      })
    );

    model.compile({
      loss: "meanSquaredError",
      optimizer: tf.train.adam(0.1),
    });

    await model.fit(trainingData, outputData, { epochs: 40 });

    await model.save("file://model");

    return true;
  }

  async function trainPosture() {
    const data = JSON.parse(
      fs.readFileSync(`data/posture-mode.json`, "utf8", (err, data) => {
        return data;
      })
    );

    const labels = [...new Set(data.map((x) => x.label))];

    console.log(labels);

    trainingData = tf.tensor2d(data.map((x) => x.activity));
    outputData = tf.tensor2d(
      data.map((x) => [
        x.label === labels[0] ? 1 : 0,
        x.label === labels[1] ? 1 : 0,
      ])
    );

    const model = tf.sequential();

    model.add(
      tf.layers.dense({
        inputShape: [6],
        activation: "sigmoid",
        units: 10,
      })
    );

    model.add(
      tf.layers.dense({
        inputShape: [10],
        activation: "sigmoid",
        units: 2,
      })
    );

    model.add(
      tf.layers.dense({
        activation: "sigmoid",
        units: 2,
      })
    );

    model.compile({
      loss: "meanSquaredError",
      optimizer: tf.train.adam(0.1),
    });

    await model.fit(trainingData, outputData, { epochs: 20 });

    await model.save("file://posture");

    return true;
  }

  async function createModel() {}

  function togglePort() {
    port.isOpen ? port.close() : port.open();
  }

  var cycles = [];

  async function predict(activityName) {
    togglePort();
    const data = JSON.parse(
      fs.readFileSync(`data/${activityName}.json`, "utf8", (err, data) => {
        return data;
      })
    );

    const labels = [...new Set(data.map((x) => x.label))];

    model = await tf.loadLayersModel("file://model/model.json");

    parser.on("data", (data) => {
      if (!isNaN(data.split(",").map((x) => parseFloat(x))[0])) {
        tf.tidy(() => {
          const input = tf.tensor2d([
            data.split(",").map((x, i) => parseFloat(x)),
          ]);
          const prediction = model.predict(input);
          const gesturePredicted = labels[prediction.argMax(-1).dataSync()[0]];
          cycles.push(gesturePredicted);

          console.log(gesturePredicted);
        });
      }
    });
  }

  async function countCycles() {
    await togglePort();

    console.log(
      cycles
        .join("")
        .replace(/idle/g, "@@@")
        .split("@@@")
        .filter((x) => x !== "")
    );
    const c = cycles
      .join("")
      .replace(/idle/g, "@@@")
      .split("@@@")
      .filter((x) => x !== "").length;
    cycles = [];
    return c;
  }

  async function postureMode(isEnabled) {
    togglePort();

    const labels = ["good", "bad"];

    model = await tf.loadLayersModel("file://posture/model.json");
    if (isEnabled) {
      var triggered = false;
      var badPosture = false;

      parser.on("data", (data) => {
        if (!isNaN(data.split(",").map((x) => parseFloat(x))[0])) {
          tf.tidy(() => {
            const input = tf.tensor2d([
              data.split(",").map((x, i) => parseFloat(x)),
            ]);
            const prediction = model.predict(input);
            const gesturePredicted =
              labels[prediction.argMax(-1).dataSync()[0]];
            cycles.push(gesturePredicted);
            badPosture = gesturePredicted === "bad" ? true : false;
            console.log(gesturePredicted);
          });
          if (badPosture) {
            if (!triggered) {
              badPostureDetected();
              triggered = true;
            }
          } else {
            triggered = false;
          }
        }
      });
    }
  }

  var timeout;
  function badPostureDetected() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      new Notification({
        title: "Bad Posture Detected",
      }).show();
    }, 1000 * 60);
  }

  return {
    loadFile,
    createModel,
    predict,
    togglePort,
    trainPosture,
    postureMode,
    countCycles,
  };
}

module.exports = { network };
