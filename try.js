var fs = require("fs");
const { features } = require("process");

for (let i = 1; 1 <= 9; i++) {
  var a = JSON.parse(
    fs.readFileSync("data/center" + i + ".txt", "utf-8", (err, data) => {
      return data;
    })
  );
  console.log(a["features"].length);
}
