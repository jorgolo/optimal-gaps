import OptimalGaps from "./optimalGaps.js";

const container = document.querySelector('.container');
const elements = document.querySelectorAll('.element');

const options = {
  container,
  elements,
  offset: 100,
};

new OptimalGaps(options);