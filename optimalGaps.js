export default class OptimalGaps {

  constructor(options) {
    // valures required
    this.$container = options.container; // Node
    this.$elements = options.elements; // Array
    this.offset = options.offset; // Int
    this.initialGap = options.initialGap; // Int

    if (this.$container == null || this.$elements == null || this.offset == null || this.initialGap == null) {
      console.warn('A required value is missing');
      return;
    }

    // optional
    this.breakpointStart = options.breakpointStart ?? null; // Int
    this.containerClass = options.containerClass ?? 'js-has-scroll'; // string
    this.minimunGap = options.minimunGap ?? 10; // Int
    this.minViewportWidth = options.minViewportWidth ?? 360; // Int
    this.cssCustomProperty = options.cssCustomProperty ?? '--optimal-gap'; // String
    this.sidePaddings = options.sidePaddings ?? 0; // Int

    // calculated
    this.maximumGap = null;
    this.maxViewportWidth = null;
    this.isFirstCalculation = true;
    this.gapsCount = this.$elements.length - 1;
    this.loadedWithScroll = false;
    this.optimalGap = 0;

    // add initial css variables
    this.$container.style.setProperty('--side-paddings', `${this.sidePaddings}px`);
    this.$container.style.setProperty('--initial-gap', `${this.initialGap}px`);

    this.startCalculations();
    this.createResizeObserver();
  }

  isBreakpointReached() {
    // we check if a breakpoint is available, then we check if we reach de breakpoint|
    return this.breakpointStart != null && window.visualViewport.width > this.breakpointStart;
  }

  startCalculations() {
    // if a breakpointStart is set, then we start the calculation starting from the value of breakpointStart
    if ( this.isBreakpointReached() ) { return; }

    this.setOptimalGaps();
  }

  createResizeObserver() {
    const resizeObserver = new window.ResizeObserver(() => {
      // Function call for start calculations
      this.startCalculations();
    });

    // Initialization of observer
    resizeObserver.observe(this.$container);
  }

  isContainerWithScrollbar() {
    // check for scroll bar in the container element
    return (this.$container.scrollWidth > this.$container.clientWidth);
  }

  elementsWidthSum() {
    // we get the additon of all elements widths
    let elementsTotalWidth = 0;
    this.$elements.forEach(($tabButton) => {
      elementsTotalWidth += $tabButton.getBoundingClientRect().width;
    });

    return elementsTotalWidth;
  }

  setOptimalGaps() {

    // First we remove the class and style properties so the elements goes back to "Normal" state
    this.$container.classList.remove(this.containerClass);
    this.$container.style.removeProperty(this.cssCustomProperty);

    // we check if we have an horizontal scrollbar
    // if we don´t have scrollbar we don´t do anything
    if (this.isContainerWithScrollbar() === false) {
      return;
    }

    // if we don´t have any elements node, we don´t do anything
    if (this.$elements.length < 1) { return; }

    // We get the width of our contaner
    const containerWidth = this.$container.getBoundingClientRect().width;

    // We get the whole remain space on the container
    const remainSpace = containerWidth - this.elementsWidthSum();

    // We calculate the optimal gaps between elements
    let calculatedGap = (remainSpace / this.gapsCount);

    // we round up
    calculatedGap = window.Math.ceil(calculatedGap);

    // we divide the offset between the gaps
    const offsetForEachGap = ( (this.offset + this.sidePaddings) / this.gapsCount);

    // we add the offset
    calculatedGap += offsetForEachGap;

    // if the calculated Gap is minor that the established minimum gap.. then we only return the minimum gap.
    if (calculatedGap < this.minimunGap) {
      calculatedGap = this.minimunGap;
    }

    // When we calculated for the first time we set our max values needed for the gradual calculation
    if (this.isFirstCalculation) {
      this.maximumGap = this.initialGap + offsetForEachGap;
      this.maxViewportWidth = (this.elementsWidthSum() + (this.gapsCount * this.initialGap) + (this.sidePaddings * 2) - 1);
      this.maxViewportWidth = Math.floor(this.maxViewportWidth);
      this.isFirstCalculation = false;
    }

    // we call the gradual calculation gaps
    calculatedGap = this.gapGradualCalculation();

    // we set the optimal gap for the widget
    this.optimalGap = calculatedGap;
    // We set the style on our container
    this.$container.style.setProperty(this.cssCustomProperty, `${this.optimalGap}px`);
    // we add the class of overflow
    this.$container.classList.add(this.containerClass);
  }

  gapGradualCalculation() {

    // We need this so we can do calculations
    if (this.maxViewportWidth == null) { return; }
    if (this.maximumGap == null) { return; }

    // We get the width of visualViewport
    const viewportWidth = window.visualViewport.width;

    // return the maximumGap on bigger view ports
    if (viewportWidth >= this.maxViewportWidth) {
      return this.maximumGap;
    }
    
    // return the minimunGap on smaller view ports
    if (viewportWidth <= this.minViewportWidth) {
      return this.minimunGap;
    }
  
    // Gradual calculation based on max and min gaps and viewport
    const viewportRange = this.maxViewportWidth - this.minViewportWidth;
    const valuesRagne = this.maximumGap - this.minimunGap;
    
    const gradualValue = this.minimunGap + ((viewportWidth - this.minViewportWidth) / viewportRange) * valuesRagne;
    return parseFloat(gradualValue.toFixed(4));
  }

}
