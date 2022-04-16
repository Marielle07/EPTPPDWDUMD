//const SerialPort = require("serialport");
//const Readline = require("@serialport/parser-readline");
const pre = require("./prediction");
const g = require("./stringToFloat");
var Worker = require("tiny-worker");
const { port, parser } = require("./reader");
//const port = new SerialPort("COM3", { baudRate: 9600 });
//const parser = port.pipe(new Readline({ delimiter: "\n" }));

var currArr = [];
var liveData = [];

const runWorker = async (gestureClasses) => {
  var worker = new Worker(function () {
    self.onmessage = function (ev) {
      postMessage(ev.data);
    };
  });

  worker.onmessage = function (ev) {
    //console.log(ev.data);
    secondtimer(gestureClasses);
    worker.terminate();
  };

  worker.postMessage("Start 2 second timer.");
  startReadingData();
};

async function secondtimer(gestureClasses) {
  while (true) {
    // await sleep(2000);
    // console.log("Two seconds has passed");

    var data = currArr;
    var removed = currArr.splice(15);
    flatterAndPredicter(data, gestureClasses);

    currArr = [];
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function startReadingData() {
  // Read the port data
  port.on("open", () => {
    console.log("Serial Port Open");
  });

  parser.on("data", (data) => {
    var initArray = g.converter(data);
    currArr.push(initArray);
  });
}

//experimental
var ctr = 0;
function flatterAndPredicter(arr, gestureClasses) {
  if (ctr == 0) {
  } else {
    pre.startPredict(arr.flat(), gestureClasses);
  }
  ctr++;
}

module.exports = { runWorker };
