var fs = require("fs");
const { features } = require("process");
const tf = require("@tensorflow/tfjs-node");

// Count Number of Files
var folderName = "./data";
var numFiles = fs.readdirSync(folderName, (err, files) => {
  withFileTypes: true;
});
console.log(numFiles);
// Get File name of Files
var files = fs.readdirSync(folderName);

// Get Data from Files and Merge
var dataArray = numFiles.map((x) => {
  return JSON.parse(
    fs.readFileSync(`data/` + x, "utf8", (err, data) => {
      return data;
    })
  );
});
console.log(dataArray);

// for (var ctr = 1; ctr <= numFiles.length; ctr++) {
//   dataArray.push(
//     JSON.parse(
//       fs.readFileSync(`data/` + numfiles[ctr], "utf8", (err, data) => {
//         return data;
//       })
//     )
//   );
// }

// Formatting Data; Note: Number of Empty Array should match the number of labels
var _labels = dataArray.map((x) => x.label);
var _features = dataArray.map((x) => x.features);
// for (var ctr = 0; ctr < dataArray.length; ctr++) {
//   var obj = dataArray[ctr];
//   var objL = obj["label"];
//   var objF = obj["features"];
//   _labels[objL].push(objL);
//   _features[objL].push(objF);
// }
// for (var ctr = 0; ctr < _labels.length; ctr++) {
//   _labels[ctr].shift();
//   _features[ctr].shift();
// }

// Converting to Tensors
_labels = _labels.flat();
console.log(_features);
const numOfLabels = dataArray.length / 10;

var numSamplesPerGesture = dataArray.length; //number of files
var totalNumDataPerFile = 15;
convertToTensors(_features, _labels);
var featuresTensor;
var labelsTensor;
function convertToTensors(featuresData, labelData) {
  featuresTensor = tf.tensor2d(
    featuresData
    //numSamplesPerGesture,
    //totalNumDataPerFile,
  );
  labelsTensor = tf.oneHot(tf.tensor1d(labelData).toInt(), numOfLabels);
}

//Splitting
var trainTesters = splitter();
var trainingFeatures = trainTesters[0];
var trainingLabels = trainTesters[1];
var testingFeatures = trainTesters[2];
var testingLabels = trainTesters[3];
function splitter() {
  const numTestExamples = Math.round(numSamplesPerGesture * 0.2);
  const numTrainExamples = numSamplesPerGesture - numTestExamples;

  const trainingFeatures = featuresTensor.slice(
    [0, 0],
    [numTrainExamples, totalNumDataPerFile]
  );
  const testingFeatures = featuresTensor.slice(
    [numTrainExamples, 0],
    [numTestExamples, totalNumDataPerFile]
  );
  const trainingLabels = labelsTensor.slice(
    [0, 0],
    [numTrainExamples, numOfLabels]
  );
  const testingLabels = labelsTensor.slice(
    [numTrainExamples, 0],
    [numTestExamples, numOfLabels]
  );
  return [trainingFeatures, trainingLabels, testingFeatures, testingLabels];
}

// Training the Model
const createModel = async (
  trainingFeatures,
  trainingLabels,
  testingFeatures,
  testingLabels
) => {
  const params = { learningRate: 0.1, epochs: 40 };
  const model = tf.sequential();
  model.add(
    tf.layers.dense({
      units: 10,
      activation: "sigmoid",
      inputShape: [trainingFeatures.shape[1]],
    })
  );
  model.add(tf.layers.dense({ units: 3, activation: "softmax" }));

  const optimizer = tf.train.adam(params.learningRate);

  model.compile({
    optimizer: optimizer,
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });

  await model.fit(trainingFeatures, trainingLabels, {
    epochs: params.epochs,
    validationData: [testingFeatures, testingLabels],
  });

  await model.save("file://model");
};

//const runCreateModel = () => {
createModel(trainingFeatures, trainingLabels, testingFeatures, testingLabels);
//};
//module.exports = { runCreateModel };
