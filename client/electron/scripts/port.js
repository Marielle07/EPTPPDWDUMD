const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
const fs = require("fs");
const { COM_PORT } = require("./config");

function device() {
  const port = new SerialPort(COM_PORT, {
    baudRate: 9600,
    autoOpen: false,
  });
  const parser = port.pipe(new Readline());

  var idleData = [];

  port.on("open", () => {
    console.log("Opened!");
  });

  port.on("close", () => {
    console.log("Closed!");
  });

  parser.on("data", (data) => {
    if (
      data.split(",").length === 6 &&
      !data
        .split(",")
        .map((x) => parseFloat(x))
        .includes(NaN)
    ) {
      console.log(
        JSON.stringify({
          activity: data.split(",").map((x, i) => parseFloat(x)),
          label: "bad",
        }) + ","
      );
    }
  });
  // parser.on("data", (data) => {
  //   if (!isNaN(data.split(",").map((x) => parseFloat(x))[0])) {
  //     console.log({
  //       activity: data.split(",").map((x, i) => parseFloat(x)),
  //       label: "idle",
  //     });
  //   }
  // });

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

  // Record Activity

  function recordActivity(activityName) {
    var recordedData = [];
    var type = "";

    parser.on("data", (data) => {
      if (!isNaN(data.split(",").map((x) => parseFloat(x))[0])) {
        recordedData.push({
          activity: data.split(",").map((x, i) => parseFloat(x)),
          label: type,
        });
        console.log({
          activity: data.split(",").map((x, i) => parseFloat(x)),
          label: type,
        });
      }
    });

    function startIdle() {
      type = "idle";
      togglePort();
    }

    function stopIdle() {
      console.log(idleData.length);
      togglePort();
    }

    function start() {
      type = activityName;
      togglePort();
    }

    async function stop() {
      // Remove duplicates
      console.log(recordedData.length);
      await togglePort();

      fs.writeFile(
        `./data/${activityName}.json`,
        JSON.stringify(recordedData, null, 2),
        (err) => {}
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
