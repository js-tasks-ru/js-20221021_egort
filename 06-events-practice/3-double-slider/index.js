export default class DoubleSlider {
  onMouseDown = (event) => {
    event.preventDefault(); // предотвратить запуск выделения (действие браузера)
    let onMouseMove;
    if (event.target.classList.contains('range-slider__thumb-left')) {
      onMouseMove = this.onMouseMoveLeftSlider;
    }
    if (event.target.classList.contains('range-slider__thumb-right')) {
      onMouseMove = this.onMouseMoveRightSlider;
    }

    document.addEventListener('pointermove', onMouseMove);
    document.addEventListener('pointerup', this.onMouseUp);
  }

  onMouseMoveLeftSlider = (event) => {
    const innerWidth = this.subElements.inner.clientWidth;
    const innerLeft = this.subElements.inner.getBoundingClientRect().left;
    let newLeftSliderPosition = Number((event.clientX - innerLeft).toFixed(0));
    let newLeftSliderPositionPercent = innerWidth > 0 ? 
                                       Number((100 * newLeftSliderPosition / innerWidth).toFixed(0)) :
                                       0; // не понимаю как иначе вычислить % смещения, если длинна слайдера не задана или она 0, как в тестах
    const rightSliderPosition = Number(this.subElements.rightSlider.getBoundingClientRect().left - innerLeft);
    const rightSliderPositionPrecent = Number((100 * rightSliderPosition / innerWidth).toFixed(0));

    if (newLeftSliderPositionPercent < 0) {
      newLeftSliderPositionPercent = 0;
    }

    if (newLeftSliderPositionPercent > rightSliderPositionPrecent) {
      newLeftSliderPositionPercent = rightSliderPositionPrecent;
    }

    this.subElements.progress.style.left = newLeftSliderPositionPercent + '%';
    this.subElements.leftSlider.style.left = newLeftSliderPositionPercent + '%';
    this.subElements.leftSpan.innerHTML = this.formatValue(this.min + Number(((this.max - this.min) * (newLeftSliderPositionPercent / 100)).toFixed(0)));
  }

  onMouseMoveRightSlider = (event) => {
    const innerWidth = this.subElements.inner.clientWidth;
    const innerRight = this.subElements.inner.getBoundingClientRect().right;
    let newRightSliderPosition = Number((innerRight - event.clientX).toFixed(0));
    let newRightSliderPositionPercent = innerWidth > 0 ? 
                                        Number((100 * newRightSliderPosition / innerWidth).toFixed(0)) :
                                        0;// не понимаю как иначе вычислить % смещения, если длинна слайдера не задана или она 0, как в тестах
    const leftSliderPosition = Number(innerRight - this.subElements.leftSlider.getBoundingClientRect().right);
    const leftSliderPositionPrecent = Number((100 * leftSliderPosition / innerWidth).toFixed(0));

    if (newRightSliderPositionPercent < 0) {
      newRightSliderPositionPercent = 0;
    }

    if (newRightSliderPositionPercent > leftSliderPositionPrecent) {
      newRightSliderPositionPercent = leftSliderPositionPrecent;
    }

    this.subElements.progress.style.right = newRightSliderPositionPercent + '%';
    this.subElements.rightSlider.style.right = newRightSliderPositionPercent + '%';
    this.subElements.rightSpan.innerHTML = this.formatValue(this.min + Number(((this.max - this.min) * ((100 - newRightSliderPositionPercent) / 100)).toFixed(0)));
  }

  onMouseUp = (event) => {
    document.removeEventListener('pointerup', this.onMouseUp);
    document.removeEventListener('pointermove', this.onMouseMoveLeftSlider);
    document.removeEventListener('pointermove', this.onMouseMoveRightSlider);
  }

  constructor({
    min = 0,
    max = 100,
    formatValue = value => value,
    selected = {
      from: min,
      to: max,
    }
  } = {}) {
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.selected = selected;

    this.render();
  }

  render() {
    const element = document.createElement("div");
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements();
    this.inisializeEventListener();

    this.subElements.leftSlider.ondragstart = function () {
      return false;
    };
    this.subElements.rightSlider.ondragstart = function () {
      return false;
    };
  }

  getTemplate() {
    const leftPercent = (100 * (this.selected.from - this.min) / (this.max - this.min)).toFixed(0);
    const reghtPercent = (100 * (this.max - this.selected.to) / (this.max - this.min)).toFixed(0);
    return `
          <div class="range-slider">
            <span data-element="from">${this.formatValue(this.selected.from)}</span>
            <div class="range-slider__inner">
              <span class="range-slider__progress" style="left: ${leftPercent}%; right: ${reghtPercent}%"></span>
              <span class="range-slider__thumb-left" style="left: ${leftPercent}%"></span>
              <span class="range-slider__thumb-right" style="right: ${reghtPercent}%"></span>
            </div>
            <span data-element="to">${this.formatValue(this.selected.to)}</span>
          </div>
        `
  }

  getSubElements() {
    const result = {};
    result.inner = this.element.querySelector('.range-slider__inner');
    result.progress = this.element.querySelector('.range-slider__progress');
    result.rightSlider = this.element.querySelector('.range-slider__thumb-right');
    result.leftSlider = this.element.querySelector('.range-slider__thumb-left');
    result.leftSpan = result.inner.previousElementSibling;
    result.rightSpan = result.inner.nextElementSibling;
    return result;
  }

  inisializeEventListener() {
    this.subElements.leftSlider.addEventListener('pointerdown', this.onMouseDown);
    this.subElements.rightSlider.addEventListener('pointerdown', this.onMouseDown);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements.leftSlider.removeEventListener('pointerdown', this.onMouseDown);
    this.subElements.rightSlider.removeEventListener('pointerdown', this.onMouseDown);
  }
}