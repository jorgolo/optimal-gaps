export default class OptimalGaps {

  $container = null;
  $elements = null;
  breakpointStart = null;
  containerClass = 'js-has-scroll';
  minimunGap = 10;
  cssCustomProperty = '--optimal-gap';
  ratio = 0.7;


  constructor(options) {
    this.$container = options.container; // Node
    this.$elements = options.elements; // Array

    this.breakpointStart = options.breakpointStart; // Int
    this.containerClass = options.containerClass ? options.containerClass : this.containerClass; // string
    this.minimunGap = options.minimunGap ? options.minimunGap : this.minimunGap; // Int
    this.cssCustomProperty = options.cssCustomProperty ? options.cssCustomProperty : this.cssCustomProperty; // String
    this.ratio = options.ratio ? options.ratio : this.ratio; // float between 1 and 0

    if (this.$container == null || this.$elements == null) {
      return;
    }

    this.startCalculations();
    this.createResizeObserver();
  }

  startCalculations() {
    if ( this.breakpointStart != null && window.visualViewport.width > this.breakpointStart) { return; }

    this.addClassToWrapper();
    this.setMinGapsForResponsive();
  }

  createResizeObserver() {
    // declaramos el observador, y lo que hara
    const resizeObserver = new window.ResizeObserver(() => {
      this.startCalculations();
    });

    // inicializamos el observador para que "vea" el resize de solo el elemento que queremos.
    resizeObserver.observe(this.$container);
  }

  addClassToWrapper() {
    // Funcion para que añada una clase al wrapper una vez que este tenga una barra horizontal

    // Quitamos la clase primero, para que se calcule todo en su "Estado normal"
    this.$container.classList.remove(this.containerClass);
    this.$container.style.removeProperty(this.cssCustomProperty);

    // hacemos el chequeo de si tiene barra horizontal
    const hasHorizontalScrollbar = (this.$container.scrollWidth > this.$container.clientWidth);

    // Si es que no se tiene barra horizontal, ya no hacemos nada.
    if (hasHorizontalScrollbar === false) {
      return;
    }

    // añadimos la clase en caso de tener barra horizontal
    this.$container.classList.add(this.containerClass);
  }

  setMinGapsForResponsive() {
    // si no tenemos la clase, no hacemos nada
    if (this.$container.classList.contains(this.containerClass) === false) {
      return;
    }

    // si no tenemos los botones no hacemos nada
    if (this.$elements.length < 1) {
      return;
    }

    // Obtenemos el ancho del contenedor con overflow
    const containerWidth = this.$container.getBoundingClientRect().width;

    // obtenemos la suma de todos los anchos del widt
    let buttonsTotalWidth = 0;
    this.$elements.forEach(($tabButton) => {
      buttonsTotalWidth += $tabButton.getBoundingClientRect().width;
    });

    // Obtenemos el espacio sobrante entre el contenedor y la suma de ls botones
    const remainSpace = containerWidth - buttonsTotalWidth;
    // calculamos el tamaño optimo obteneiendo el espacio restante dividido entre la cantidad de espacios entre elementos
    let optimalGap = (remainSpace / (this.$elements.length - 1));

    // añadimos un ratio de separacion
    optimalGap = optimalGap * (2 - this.ratio);

    // rendondeamos hacia arriba
    optimalGap = window.Math.ceil(optimalGap);

    // Si llegamos al tamaño minimo de separacion, ya no hacemos nada
    if (optimalGap < this.minimunGap) {
      this.$container.style.setProperty(this.cssCustomProperty, `${this.minimunGap}px`);
      return;
    }

    // Ponemos la propiedad en el noodo
    this.$container.style.setProperty(this.cssCustomProperty, `${optimalGap}px`);
  }

}
