import OptimalGaps from "../optimalGaps.min.js";

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

// -----------------

const container2 = document.querySelector('.container-2');
const elements2 = document.querySelectorAll('.element-2');

const options2 = {
  container: container2,
  elements: elements2,
  offset: '30%',
  initialGap: 35,
  minimunGap: 15,
  sidePaddings: 30,
  minViewportWidth: 360,
};

new OptimalGaps(options2);