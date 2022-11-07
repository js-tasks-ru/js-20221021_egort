export default class ColumnChart {
  constructor({
    label = '',
    link = '',
    data = [],
    formatHeading = data => data,
    value = 0,
  } = {}) {
    this.label = label;
    this.link = link;
    this.value = formatHeading(value);
    this.data = data;
    this.chartHeight = 50;

    this.render();
    //this.initEventListeners();
  }

  getTemplate() {
    return `
            <div class="column-chart" style="--chart-height: ${this.chartHeight}">
              <div class="column-chart__title">
              ${this.label}
              </div>
              <div class="column-chart__container">
                <div data-element="header" class="column-chart__header">${this.value}</div>
                <div data-element="body" class="column-chart__chart">
                </div>
              </div>
            </div>
        `;
  }

  render() {
    const element = document.createElement("div"); // (*)

    element.innerHTML = this.getTemplate();
    // NOTE: в этой строке мы избавляемся от обертки-пустышки в виде `div`
    // который мы создали на строке (*)
    this.element = element.firstElementChild;

    // 1 вставить линку
    this.renderLink();
    // 2 вставить html в тело
    this.renderData();

  }

  renderLink() {
    if (this.link) {
      const elementLink = document.createElement('a');
      elementLink.href = this.link;
      elementLink.classList.add('column-chart__link');
      elementLink.textContent = 'View all';
      this.element.querySelector('.column-chart__title').append(elementLink);
    }
  }

  renderData() {
    if (this.data.length) {
      const arrayColumnPropsData = this.getColumnProps(this.data);

      const columnDataHTML = arrayColumnPropsData.map( item => {
        return `<div style="--value: ${item.value}" data-tooltip="${item.percent}"></div>`;
      }).join('');
      this.element.querySelector('.column-chart__chart').innerHTML = columnDataHTML;

    } else {
      this.renderNoData();
    }
  }

  renderNoData() {
    this.element.classList.add('column-chart_loading');
  }

  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }

  // initEventListeners() {
  //   // NOTE: в данном методе добавляем обработчики событий, если они есть
  // }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    // NOTE: удаляем обработчики событий, если они есть
  }

  update(newData) {
    // Компонент должен иметь метод update
    // с помощью которого можно передать другой массив данных для отображения колонок чарта
    this.element.querySelector('.column-chart__chart').innerHTML = '';
    this.data = newData;
    this.renderData();
  }
}