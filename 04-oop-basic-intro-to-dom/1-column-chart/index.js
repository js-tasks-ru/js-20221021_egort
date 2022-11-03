export default class ColumnChart {
  constructor(chart) {
    this.chart = chart;
    this.chartHeight = 50;

    this.render();
    this.initEventListeners();
  }

  getTemplate() {
    return `
            <div class="column-chart" style="--chart-height: ${this.chartHeight}">
              <div class="column-chart__title">
                Default_title
              </div>
              <div class="column-chart__container">
                <div data-element="header" class="column-chart__header">0</div>
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
    // 0 если данных нет
    if (!this.chart) {
      this.element.className += ' column-chart_loading';
    } else {
      // 1 вставить title
      if (this.chart.label) {
        this.element.querySelector('.column-chart__title').textContent = this.chart.label;
      }
      // 2 вставить линку
      if (this.chart.link) {
        const elementLink = document.createElement('a');
        elementLink.href = this.chart.link;
        elementLink.className += 'column-chart__link';
        elementLink.textContent = 'View all';
        this.element.querySelector('.column-chart__title').firstChild.after(elementLink);
      }
      // 3 вставить значение хедера
      if (this.chart.value) {
        this.element.querySelector('.column-chart__header').textContent = this.chart.formatHeading ?
          this.chart.formatHeading(this.chart.value) :
          this.chart.value;
      }
      // 4 вставить html в тело
      this.renderData();
    }

  }

  renderData() {
    if (this.chart.data && this.chart.data.length > 0) {
      const arrayColumnPropsData = this.getColumnProps(this.chart.data);

      let elementColumnData;

      for (const columnPropsData of arrayColumnPropsData) {
        elementColumnData = document.createElement('div');
        elementColumnData.style = '--value: ' + columnPropsData.value;
        elementColumnData.setAttribute('data-tooltip', columnPropsData.percent);
        this.element.querySelector('.column-chart__chart').append(elementColumnData);
      }
    } else {
      this.element.className += ' column-chart_loading';
    }
  }

  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = 50 / maxValue;

    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }

  initEventListeners() {
    // NOTE: в данном методе добавляем обработчики событий, если они есть
  }

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
    const container = this.element.querySelector('.column-chart__chart'); // хотел для удаления использовать replacedChildren() но тесты не пропускают
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    this.chart.data = newData;
    this.renderData();
  }
}