const tf = require("@tensorflow/tfjs-node");
const fs = require("fs");
const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");

function network() {
  var trainingData;

  const port = new SerialPort("COM4", { baudRate: 9600, autoOpen: false });
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
  }

  async function createModel() {}

  function togglePort() {
    port.isOpen ? port.close() : port.open();
  }

  async function predict() {
    togglePort();
    const data = JSON.parse(
      fs.readFileSync(`data/Jump.json`, "utf8", (err, data) => {
        return data;
      })
    );

    const labels = [...new Set(data.map((x) => x.label))];

    console.log(labels);
    model = await tf.loadLayersModel("file://model/model.json");

    const cycles = [];
    parser.on("data", (data) => {
      if (!isNaN(data.split(",").map((x) => parseFloat(x))[0])) {
        tf.tidy(() => {
          const input = tf.tensor2d([
            data.split(",").map((x, i) => parseFloat(x)),
          ]);
          const prediction = model.predict(input);
          const gesturePredicted = labels[prediction.argMax(-1).dataSync()[0]];
          cycles.push(gesturePredicted);
        });
      }
    });
  }

  return {
    loadFile,
    createModel,
    predict,
    togglePort,
  };
}

module.exports = { network };
