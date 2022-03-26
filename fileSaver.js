var fs = require("fs");

var dict = {};
//start(dummy, dummyLabel);

function start(arr, label) {
  var data = arr;
  var removed = arr.splice(15);
  return formatter(data, label);
  //   for (let i = 1; i < 5; i++) {
  //console.log(i);
  //}
}

function formatter(data, label) {
  dict["features"] = data.flat();
  dict["label"] = label;
  return dict;
}
module.exports = { start };
