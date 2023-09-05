import OptimalGaps from "./optimalGaps.js";

const container = document.querySelector('.container');
const elements = document.querySelectorAll('.element');

const options = {
  container,
  elements,
  offset: 100,
  initialGap: 20,
  minimunGap: 15,
  sidePaddings: 15,
  minViewportWidth: 400,
};

new OptimalGaps(options);