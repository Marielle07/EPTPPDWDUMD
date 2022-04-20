const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
const fs = require("fs");

function device() {
  const positions = ["X", "Y", "Z", "A", "B", "C"];
  const port = new SerialPort("COM4", { baudRate: 9600, autoOpen: false });
  const parser = port.pipe(new Readline());

  port.on("open", () => {
    console.log("Opened!");
  });

  port.on("close", () => {
    console.log("Closed!");
  });

  /* Testing Data
    {
        activity: [
            { X: 0.4, Y: -0.4, Z: -10.7, A: 0, B: 0, C: 0 },
            { X: 0.4, Y: -0.4, Z: -10.7, A: 0, B: 0, C: 0 },
            { X: 0.4, Y: -0.4, Z: -10.7, A: 0, B: 0, C: 0 },
            ...
        ],
        label: "Push Ups"
    } 
  */

  /*
    Training Data
    [
      {
          activity: [...],
          label: "Push Ups"
      },
      {
          activity: [...],
          label: "Push Ups"
      },
      {
          activity: [...],
          label: "Push Ups"
      }
    ]
  */

  function togglePort() {
    port.isOpen ? port.close() : port.open();
  }

  // Record Activity

  function recordActivity(activityName) {
    var activity = [];

    parser.on("data", (data) => {
      if (!isNaN(data.split(",").map((x) => parseFloat(x))[0])) {
        activity.push(
          Object.assign(
            {},
            ...data
              .split(",")
              .map((x, i) => ({ [`${positions[i]}`]: parseFloat(x) }))
          )
        );
      }
    });

    function start() {
      togglePort();
    }

    function stop() {
      const data = {
        activity: activity.slice(0, 30),
        label: activityName,
      };
      fs.readFile(`./data/${activityName}.json`, "utf8", (err, prev) => {
        if (err) {
          fs.writeFile(
            `./data/${activityName}.json`,
            JSON.stringify([data], null, 2),
            (err) => {
              togglePort();
            }
          );
        } else {
          fs.writeFile(
            `./data/${activityName}.json`,
            JSON.stringify(JSON.parse(prev).concat(data), null, 2),
            (err) => {
              togglePort();
            }
          );
        }
      });
    }

    return {
      start,
      stop,
    };
  }

  return {
    togglePort,
    recordActivity,
  };
}

module.exports = { device };
