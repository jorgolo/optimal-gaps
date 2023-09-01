export default class OptimalGaps {

  constructor(options) {
    // valures required
    this.$container = options.container; // Node
    this.$elements = options.elements; // Array
    this.offset = options.offset; // Int

    if (this.$container == null || this.$elements == null || this.offset == null) {
      console.warn('A required value is missing');
      return;
    }

    // optional
    this.breakpointStart = options.breakpointStart ?? null; // Int
    this.containerClass = options.containerClass ?? 'js-has-scroll'; // string
    this.minimunGap = options.minimunGap ?? 10; // Int
    this.minViewportWidth = options.minViewportWidth ?? 360; // Int
    this.cssCustomProperty = options.cssCustomProperty ?? '--optimal-gap'; // String

    // calculated
    this.maximumGap = null;
    this.maxViewportWidth = null;
    this.firstCalculation = true;


    this.startCalculations();
    this.createResizeObserver();
  }

  startCalculations() {
    // if a breakpointStart is set, then we start the calculation starting from the value of breakpointStart
    if ( this.breakpointStart != null && window.visualViewport.width > this.breakpointStart) { return; }

    this.addClassToWrapper();
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

  addClassToWrapper() {
    // We add a class to the element container when horizontal scrollbar appears

    // First we remove the class and style propertie so the elements goes back to "Normal" state
    this.$container.classList.remove(this.containerClass);
    this.$container.style.removeProperty(this.cssCustomProperty);

    // Check for horizontal scrollbar
    const hasHorizontalScrollbar = (this.$container.scrollWidth > this.$container.clientWidth);

    // if we don´t have scrollbar we don´t do anything
    if (hasHorizontalScrollbar === false) { return; }

    // if a scrollbar is present we add the class
    this.$container.classList.add(this.containerClass);
  }

  setOptimalGaps() {
    // we only star calculation the optimal gaps if we have our "containerClass"
    if (this.$container.classList.contains(this.containerClass) === false) {
      return;
    }

    // if we don´t have any elements node, we don´t do anything
    if (this.$elements.length < 1) { return; }

    // We get the width of our contaner
    const containerWidth = this.$container.getBoundingClientRect().width;

    // we get the additon of al elements widths
    let buttonsTotalWidth = 0;
    this.$elements.forEach(($tabButton) => {
      buttonsTotalWidth += $tabButton.getBoundingClientRect().width;
    });

    // We get the whole remain space on the container
    const remainSpace = containerWidth - buttonsTotalWidth;

    // we calculate the gaps
    const gapsCount = this.$elements.length - 1;

    // We calculate the optimal gaps between elements
    let optimalGap = (remainSpace / gapsCount);

    // we round up
    optimalGap = window.Math.ceil(optimalGap);

    // we add the offset
    optimalGap += (this.offset / gapsCount);

    // When we calculated for the first time we set our max values needed for the gradual calculation
    if (this.firstCalculation) {
      this.firstCalculation = false;
      this.maximumGap = optimalGap;
      this.maxViewportWidth = window.visualViewport.width;
    }

    // we call the gradual calculation gaps
    optimalGap = this.gapCalculation();

    // We set the style on our container
    this.$container.style.setProperty(this.cssCustomProperty, `${optimalGap}px`);
  }

  gapCalculation() {

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
