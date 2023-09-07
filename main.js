import OptimalGaps from "./optimalGaps.js";

const container = document.querySelector('.container');
const elements = document.querySelectorAll('.element');

const options = {
  container,
  elements,
  offset: '30%',
  initialGap: 20,
  minimunGap: 15,
  sidePaddings: 20,
  minViewportWidth: 400,
};

new OptimalGaps(options);