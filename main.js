import OptimalGaps from "./optimalGaps.js";

const container = document.querySelector('.container');
const elements = document.querySelectorAll('.element');

const options = {
  container,
  elements,
  // breakpointStart: 680,
  ratio: 0.2,
};

new OptimalGaps(options);