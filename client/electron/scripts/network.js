const tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-node");
const fs = require("fs");

function network() {
  var trainingData;
  var outputData;
  var testingData;
  var model = tf.sequential();
  var inputShape;
  // setup data
  function loadFile(activityName) {
    const data = JSON.parse(
      fs.readFileSync(`data/${activityName}.json`, "utf8", (err, data) => {
        return data;
      })
    );
    trainingData = tf.tensor2d(
      data.map((x) =>
        x.activity.map(({ X, Y, Z, A, B, C }) => [X, Y, Z, A, B, C].flat())
      )
    );

    inputShape = data.map((x) => x.activity.length);

    console.log(inputShape);

    // console.log(
    //   data.map((x) =>
    //     x.activity.map(({ X, Y, Z, A, B, C }) => [X, Y, Z, A, B, C])
    //   )
    // );

    outputData = tf.tensor2d(
      data.map((x) => [
        x.label === activityName ? 1 : 0,
        x.label !== activityName ? 1 : 0,
      ])
    );
    testingData = tf.tensor2d([
      data[0].activity.map(({ X, Y, Z, A, B, C }) => [X, Y, Z, A, B, C].flat()),
    ]);
  }

  // build neural network

  async function createModel() {
    model.add(
      tf.layers.dense({
        inputShape: [30],
        activation: "relu",
        units: 1,
      })
    );
    model.add(
      tf.layers.dense({
        inputShape: [1],
        activation: "relu",
        units: 2,
      })
    );
    model.add(
      tf.layers.dense({
        activation: "relu",
        units: 2,
      })
    );
    model.compile({
      loss: "meanSquaredError",
      optimizer: tf.train.adam(0.06),
    });
    const h = await model.fit(trainingData, outputData, {
      epochs: 40,
    });

    console.log(h);

    await model.save("file://model");
    console.log("Model Created!");
  }

  // train/fit neural network
  // test

  return {
    loadFile,
    createModel,
  };
}

module.exports = { network };
