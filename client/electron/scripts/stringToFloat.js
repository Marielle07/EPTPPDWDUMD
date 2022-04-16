function converter(text) {
  //console.log(text);
  return text.split(",").map((x) => {
    return parseFloat(x);
  });
}

module.exports = { converter };
