export default class OptimalGaps {

  constructor(options) {
    // Values required
    this.$container = options.container; // Node
    this.$elements = options.elements; // Array
    this.offset = options.offset; // String '100px' or '20%'
    this.initialGap = options.initialGap; // Int

    if (this.$container == null || this.$elements == null || this.offset == null || this.initialGap == null) {
      console.warn('A required value is missing');
      return;
    }

    // Optional
    this.breakpointStart = options.breakpointStart ?? null; // Int
    this.containerClass = options.containerClass ?? 'js-has-scroll'; // string
    this.minimunGap = options.minimunGap ?? 10; // Int
    this.minViewportWidth = options.minViewportWidth ?? 360; // Int
    this.cssCustomProperty = options.cssCustomProperty ?? '--optimal-gap'; // String
    this.sidePaddings = options.sidePaddings ?? 0; // Int

    // Calculated
    this.maximumGap = null;
    this.maxViewportWidth = null;
    this.isFirstCalculation = true;
    this.gapsCount = this.$elements.length - 1;
    this.loadedWithScroll = false;
    this.optimalGap = 0;

    // addition of the  initial css variables
    this.$container.style.setProperty('--side-paddings', `${this.sidePaddings}px`);
    this.$container.style.setProperty('--initial-gap', `${this.initialGap}px`);

    this.startCalculations();
    this.createResizeObserver();
  }

  isBreakpointReached() {
    // Check for a breakpoint existence and then we check if we reach de breakpoint
    return this.breakpointStart != null && window.visualViewport.width > this.breakpointStart;
  }

  startCalculations() {
    // If a breakpoint is set, then we only start the calculations from the value of the breakpoint and below
    if ( this.isBreakpointReached() ) { return; }

    // The funcition that calculate the optimal gaps
    this.setOptimalGaps();
  }

  createResizeObserver() {
    // Creation of the resize observer to watch only the resize of the "container"
    const resizeObserver = new window.ResizeObserver(this.startCalculations.bind(this));

    // Initialization of the observer for the "container"
    resizeObserver.observe(this.$container);
  }

  isContainerWithScrollbar() {
    // check for the scroll bar in the container element
    // return (this.$container.scrollWidth > this.$container.clientWidth);
    return this.$container.clientWidth < this.$container.children[0].getBoundingClientRect().width;
  }

  elementsWidthSum() {
    // Calculation of the addition of all elements widths
    let elementsTotalWidth = 0;
    this.$elements.forEach(($tabButton) => {
      elementsTotalWidth += $tabButton.getBoundingClientRect().width;
    });

    return elementsTotalWidth;
  }

  calculatingOffset() {
    // Returning an integer number if is set to pixels
    if (this.offset.includes('px')) {
      return parseInt(this.offset);
    }

    // If the code reach here then is with porcentage, then we calculate the porcentage according the last element.
    const lastElement = this.$elements[this.$elements.length - 1];
    const lastElementWidth = lastElement.getBoundingClientRect().width;
    const offsetPercent = parseInt(this.offset);
    const offset = (offsetPercent * lastElementWidth / 100);
    return parseFloat(offset.toFixed(4));
  }

  setOptimalGaps() {

    // if we don´t have any elements, we don´t do anything
    if (this.$elements.length <= 1) { return; }

    // First we remove the class and style properties so the elements goes back to "Normal" state
    this.$container.classList.remove(this.containerClass);
    this.$container.style.removeProperty(this.cssCustomProperty);

    // checking for the existence of scrollbar in the "container"
    // if we don´t have scrollbar we don´t do anything
    if (this.isContainerWithScrollbar() === false) {
      return;
    }

    // Getting the width of the container
    const containerWidth = this.$container.getBoundingClientRect().width;

    // Getting the whole remain space on the container
    const remainSpace = containerWidth - this.elementsWidthSum();

    // Calculation of the optimal gaps between elements
    let calculatedGap = (remainSpace / this.gapsCount);

    // round up for the gaps
    calculatedGap = window.Math.ceil(calculatedGap);

    // Splitting the offset between the gaps
    // const offsetForEachGap = ( (this.offset + this.sidePaddings) / this.gapsCount);
    const offsetForEachGap = ( (this.calculatingOffset() + this.sidePaddings) / this.gapsCount);

    // calculation for the new gaps with the offset
    calculatedGap += offsetForEachGap;

    // if the calculated Gap is less that the minimum gap then we only return the minimum gap.
    if (calculatedGap < this.minimunGap) {
      calculatedGap = this.minimunGap;
    }

    // Calculation of the Max Values in the first time calculation
    if (this.isFirstCalculation) {
      this.maximumGap = this.initialGap + offsetForEachGap;
      this.maxViewportWidth = (this.elementsWidthSum() + (this.gapsCount * this.initialGap) + (this.sidePaddings * 2) - 1);
      this.maxViewportWidth = Math.floor(this.maxViewportWidth);
      this.isFirstCalculation = false;
    }

    // Calculation of the optimal gap but gradual according to the viewport width
    calculatedGap = this.gapGradualCalculation();

    // Setting the optimal gap for the widget
    this.optimalGap = calculatedGap;
    // Setting the style on our container
    this.$container.style.setProperty(this.cssCustomProperty, `${this.optimalGap}px`);
    // Setting the class for overflow
    this.$container.classList.add(this.containerClass);
  }

  gapGradualCalculation() {

    // If we don´t have any of this values we don´t do anything
    if (this.maxViewportWidth == null) { return; }
    if (this.maximumGap == null) { return; }

    // Getting the width of visualViewport
    const viewportWidth = window.visualViewport.width;

    // return of the maximumGap on bigger viewports
    if (viewportWidth >= this.maxViewportWidth) {
      return this.maximumGap;
    }
    
    // return of the minimunGap on smaller viewports
    if (viewportWidth <= this.minViewportWidth) {
      return this.minimunGap;
    }
  
    // Gradual calculation based on max and min gaps and the viewport
    const viewportRange = this.maxViewportWidth - this.minViewportWidth;
    const valuesRagne = this.maximumGap - this.minimunGap;
    const gradualValue = this.minimunGap + ((viewportWidth - this.minViewportWidth) / viewportRange) * valuesRagne;

    // Return of the calculated gap but with only 4 decimals
    return parseFloat(gradualValue.toFixed(4));
  }

}
