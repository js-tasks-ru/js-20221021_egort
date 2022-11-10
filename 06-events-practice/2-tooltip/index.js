class Tooltip {
  static instance;

  constructor() {
    if (Tooltip.instance) return Tooltip.instance;
    Tooltip.instance = this;
  }

  initialize() {
    document.addEventListener('pointerover', (event) => {
      //проверить что здесь есть тултип
      const tooltipText = event.target.dataset.tooltip;
      if (tooltipText === undefined) return;

      this.render(tooltipText);

      //повесить функцию движения тултипа на маусмув
      const onMouseMove = (event) => {
        this.element.style.left = 30 + event.pageX - this.element.offsetWidth / 2 + 'px';
        this.element.style.top = 30 + event.pageY - this.element.offsetHeight / 2 + 'px';
      };
      document.addEventListener('pointermove', onMouseMove);
      //повесить функцию удаления движения тултипа с маусмув, при маусаут
      const onMouseOut = (event) => {
        document.removeEventListener('pointermove', onMouseMove);
        document.removeEventListener('pointerout', onMouseOut);
        this.remove();
      }
      document.addEventListener('pointerout', onMouseOut);
    });
  }

  render(text) {
    let tooltipElem = document.createElement('div');

    tooltipElem.className = 'tooltip';
    tooltipElem.innerHTML = text;
    tooltipElem.style.position = 'absolute';
    tooltipElem.style.zIndex = 1000;
    document.body.append(tooltipElem);

    this.element = tooltipElem;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    // NOTE: удаляем обработчики событий, если они есть
    this.element = null;
    this.subElements = {};
  }
}

export default Tooltip;
