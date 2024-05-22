/**
 *
 * @param {number} val
 * @param {number} min
 * @param {number} max
 */
function between(val, min, max) {
  return Math.max(min, Math.min(val, max));
}

/**
 * calcul le scaling en fonction de la distance
 * @param {number} distance
 */
function scaling(distance) {
  return Math.max(Math.min(-0.2 * Math.pow(distance, 2) + 1.05, 1), 0);
}

const TransformOrigins = {
  "-1": "right",
  0: "center",
  1: "left",
};

/**
 * @property {HTMLElement} root
 * @property {HTMLElement[]} icons
 * @property {number} iconSize
 * @property {number} mousePosition
 */
class Dock {
  /**
   *
   * @param {HTMLElement} el
   */
  scale = 0.5;

  constructor(el) {
    this.root = el;
    this.icons = Array.from(el.querySelectorAll(".dock__icons"));
    this.iconSize = this.icons[0].offsetWidth;
    this.bar = document.querySelector('.superbar');
    
    el.addEventListener("mousemove", this.handleMouseMove.bind(this));
    el.addEventListener("mouseleave", this.handleMouseLeave.bind(this));
    el.addEventListener("mouseenter", this.handleMouseEnter.bind(this));
  }

  /**
   *
   * @param {MouseEvent} e
   */
  handleMouseMove(e) {
    this.mousePosition = between(
      (e.clientX - this.root.offsetLeft) / this.iconSize,
      0,
      this.icons.length
    );
    this.scaleIcons();
    this.adjustParentWidth();

  }

  handleMouseLeave(){
    this.root.classList.add('animated');

    this.icons.forEach((icon) => {
        icon.style.removeProperty("transform");
        icon.style.removeProperty("transform-origin");
    })
    this.root.style.width = '';
  }
  handleMouseEnter(){
    this.root.classList.add('animated');
    window.setTimeout(() =>{
        this.root.classList.remove('animated');
    }, 100)
  }

  scaleIcons() {
    const currentIndex = Math.floor(this.mousePosition);
    const centerOffset = this.mousePosition - currentIndex - 0.5;
    // this.bar.style.width = `${this.root.offsetWidth}px`;
    // console.log(this.bar.offsetWidth)

    let baseOffset = this.scaleFromDirection(currentIndex, 0, -centerOffset * this.iconSize);
    let offset = baseOffset * (0.5 - centerOffset) + 0.1; 
    for (let i = currentIndex + 1; i < this.icons.length; i++) {
      offset += this.scaleFromDirection(i, 1, offset);
    }
    offset = baseOffset * (0.5 + centerOffset) - 0.1; 
    for (let i = currentIndex - 1; i >= 0; i--) {
        offset += this.scaleFromDirection(i, -1, -offset);
    }

   
  }

  /**
   * @param {number} index Index de l'icône à agrandir
   * @param {number} direction Position de l'icône (0: centre, -1: gauche, 1: droite)
   * @param {number} offset Décalage à appliquer à l'icône
   * @return Valeur de décalage créé par l'agrandissement de l'icône
   */
  scaleFromDirection(index, direction, offset) {
    const center = index + 0.5;
    const distanceFromPointer = this.mousePosition - center;
    const scale = scaling(distanceFromPointer) * this.scale;
    const icon = this.icons[index];
    icon.style.setProperty(
      "transform",
      `translateX(${offset}px) scale(${scale + 1})`
    );

    icon.style.setProperty(
      "transform-origin",
      `${TransformOrigins[direction.toString()]} bottom`
    );


    return scale * this.iconSize;
  }

  adjustParentWidth() {
    let totalWidth = 0;

    this.icons.forEach(icon => {
      const style = window.getComputedStyle(icon);
      const transform = style.transform;

      if (transform && transform !== 'none') {
        const matrix = new DOMMatrix(transform);
        const transformedWidth = icon.offsetWidth * matrix.a; // Utilisez le facteur d'échelle X
        totalWidth += transformedWidth;
      } else {
        totalWidth += icon.offsetWidth;
      }
    });

    this.root.style.width = `${totalWidth + this.iconSize * this.scale}px`;
    this.root.style.justifyContent = 'center';
  }

  updateIcons(){
    this.icons = Array.from(this.root.querySelectorAll(".dock__icons"));
  }
  
  
  
  
}
