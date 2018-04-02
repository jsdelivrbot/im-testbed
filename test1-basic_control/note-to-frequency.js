function frequency(keyNumber) {
  // how many keys above A4 (key #57)
  var floatFreq = parseFloat((440 * Math.pow(2, (keyNumber - 57) / 12)), 10);
  // round to the nearest 2 decimal places and return a Number, not a string
  return parseFloat(floatFreq.toFixed(2), 10);
}
