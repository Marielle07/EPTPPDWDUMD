function converter(text) {
  var firstArray = [];
  var length = text.length;
  var num = "";
  for (let i = 0; i < length; i++) {
    if (text[i] != ",") {
      var num = num + text[i];
      if (i == length - 1) {
        addToFirstArray(num);
      }
    } else {
      addToFirstArray(num);
      num = "";
    }
  }

  function addToFirstArray(num) {
    firstArray.push(parseFloat(num));
  }
  return firstArray;
}

module.exports = { converter };
