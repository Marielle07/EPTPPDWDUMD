const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
const port = new SerialPort("COM3", { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: "\n" }));
var Worker = require("tiny-worker");

const g = require("./stringToFloat");
const h = require("./fileSaver");
var initArr = [];
var removeIndex = [];
var fs = require("fs");

var worker = new Worker(function () {
  self.onmessage = function (ev) {
    postMessage(ev.data);
  };
});

worker.onmessage = function (ev) {
  console.log(ev.data);
  secondtimer();
  worker.terminate();
};
worker.postMessage("Start 2 second timer.");
readData();

async function secondtimer() {
  for (let i = 0; i <= 11; i++) {
    await sleep(2000);
    console.log("Two seconds has passed");
    var tempo = h.start(initArr, 2);
    fs.appendFile(
      `data/` + `right` + i + `.txt`,
      JSON.stringify(tempo),
      function (err) {
        if (err) throw err;
        console.log("saved!");
      }
    );
    initArr = [];
  }
  process.exit();
}
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
function readData() {
  port.on("open", () => {
    console.log("serial port open");
  });

  parser.on("data", (data) => {
    var arr = g.converter(data);
    initArr.push(arr);
  });
}
