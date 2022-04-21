const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
const fs = require("fs");

function device() {
  const port = new SerialPort("COM4", { baudRate: 9600, autoOpen: false });
  const parser = port.pipe(new Readline());

  var idleData = [];

  port.on("open", () => {
    console.log("Opened!");
  });

  port.on("close", () => {
    console.log("Closed!");
  });

  parser.on("data", (data) => {
    if (!isNaN(data.split(",").map((x) => parseFloat(x))[0])) {
      console.log({
        activity: data.split(",").map((x, i) => parseFloat(x)),
        label: "idle",
      });
    }
  });

  /* Training Data
    {
        activity: [0.4, -0.4, -10.7, 0,  0,  0],
        label: "Push Ups"
    },
    {
        activity: [0.4, -0.4, -10.7, 0,  0,  0],
        label: "Push Ups"
    }
  */

  function togglePort() {
    port.isOpen ? port.close() : port.open();
  }

  function recordIdleToggle() {
    togglePort();
  }

  // Record Activity

  function recordActivity(activityName) {
    var recordedData = [];
    var idleData = [];

    function startParser(name) {
      parser.on("data", (data) => {
        if (!isNaN(data.split(",").map((x) => parseFloat(x))[0])) {
          idleData.push({
            activity: data.split(",").map((x, i) => parseFloat(x)),
            label: name,
          });
        }
      });
    }

    function startIdle() {
      togglePort();
      startParser("idle");
    }

    function stopIdle() {
      togglePort();
    }

    function start() {
      togglePort();
      startParser(activityName);
    }

    function stop() {
      // Remove duplicates

      fs.writeFile(
        `./data/${activityName}.json`,
        JSON.stringify(recordedData.concat(idleData), null, 2),
        (err) => {
          togglePort();
        }
      );
    }

    return {
      start,
      stop,
      startIdle,
      stopIdle,
    };
  }

  return {
    togglePort,
    recordActivity,
  };
}

module.exports = { device };
