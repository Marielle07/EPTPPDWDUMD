const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
const port = new SerialPort("COM4", { baudRate: 9600, autoOpen: true });
const parser = port.pipe(new Readline({ delimiter: "\n" }));

var Worker = require("tiny-worker");
const { gestureClasses } = require("./prediction");

const stringToFloat = require("./stringToFloat");
const fileSaver = require("./fileSaver");
var initArr = [];
var fs = require("fs");

const runWorker = async (dir) => {
  return new Promise((resolve) => {
    var worker = new Worker(function () {
      self.onmessage = function (ev) {
        postMessage(ev.data);
      };
    });

    worker.onmessage = async function (ev) {
      console.log(ev.data);
      await secondtimer(dir);
      worker.terminate();
      port.pause();
      resolve();
    };
    worker.postMessage("Start 2 second timer.");
  });
};

async function secondtimer(dir) {
  //[...Array(10)].forEach(async (_, i) => {
  var i = 0;
  var numFiles = fs.readdirSync("./data", (err, files) => {
    withFileTypes: true;
  });
  while (i <= 10) {
    await sleep(2000);
    console.log("Two seconds has passed");

    //const dirIndex = gestureClasses
    //.map((x) => x.toLowerCase())
    // .indexOf(dir.toLowerCase());
    var tempo = fileSaver.start(initArr, numFiles.length / 10);
    fs.writeFile(
      `data/${dir.toLowerCase()}${i}.json`,
      JSON.stringify(tempo, null, 2),
      function (err) {
        if (err) throw err;
        console.log("saved!");
      }
    );
    //});

    initArr = [];
    i++;
    //});
  }
  fs.unlink(`data/${dir.toLowerCase()}0.json`, () => {});

  //for (let i = 0; i <= 11; i++) {
  //   await sleep(2000);
  //   console.log("Two seconds has passed");
  //   var tempo = fileSaver.start(initArr, 2);
  //   fs.appendFile(
  //     `data/` + `right` + i + `.txt`,
  //     JSON.stringify(tempo),
  //     function (err) {
  //       if (err) throw err;
  //       console.log("saved!");
  //     }
  //   );
  //   initArr = [];
  // }
  //process.exit();
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
async function readData() {
  return new Promise((resolve) => {
    //port.close();
    port.resume();

    resolve();
    port.on("open", () => {
      console.log("serial port open");
    });
    parser.on("data", (data) => {
      var arr = stringToFloat.converter(data);
      //console.log(arr);
      //console.log(data);
      initArr.push(arr);
    });
  });
}

module.exports = { readData, runWorker, port, parser };
