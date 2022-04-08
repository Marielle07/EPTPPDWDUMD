const tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-node");

const gestureClasses = ["Center", "Left", "Right"];
var model;
var _liveData;
const init = async (liveData) => {
  _liveData = liveData;
  model = await tf.loadLayersModel("file://model/model.json");
  predict(model);
};
const predict = (model) => {
  tf.tidy(() => {
    const input = tf.tensor2d(_liveData, [1, 90]);
    const prediction = model.predict(input);
    const gesturePredicted =
      gestureClasses[prediction.argMax(-1).dataSync()[0]];
    console.log(gesturePredicted);
  });
};

function startPredict(liveData) {
  init(liveData);
}

//liveData1 = []
// startPredict(liveData1)

module.exports = { startPredict, gestureClasses };
