export default class SortableTable {
  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {
    this.headerConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;
    this.isSortLocally = true;

    this.render();

    if (this.sorted.id) {
      this.sort(this.sorted.id, this.sorted.order);
    }
  }

  getTemplate() {
    return `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
          <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.getColumnHeader()}
          </div>
          <div data-element="body" class="sortable-table__body">
          ${this.getColumnBody()}
          </div>
        </div>
      </div>
    `
  }

  getColumnHeader() {
    return this.headerConfig
      .map(item => {
        const sortSpan = item.sortable ?
          `<span data-element="arrow" class="sortable-table__sort-arrow">
            <span class="sort-arrow"></span>
          </span>` :
          '';

        return `
        <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}">
          <span>${item.title}</span>
          ${sortSpan}
        </div>`;
      })
      .join("");
  }

  getColumnBody() {
    return this.data
      .map(item => {
        return `<a href="/products/${item.id}" class="sortable-table__row">
                  ${this.headerConfig
            .map(column => {
              if (column.template) {
                return column.template(item[column.id]);
              } else {
                return `<div class="sortable-table__cell">${item[column.id]}</div>`;
              }
            })
            .join("")
          }</a>`
      })
      .join("");
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }

    return result;
  }

  render() {
    const element = document.createElement("div");
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements();
    this.subElements.header.addEventListener('pointerdown', (event) => {
      const div = event.target.closest('div');
      if (!div) return;
      const field = div.dataset.id;
      const orderValue = div.dataset.order === 'desc' ? 'asc' : 'desc';
      this.sort(field, orderValue);
    });

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

  sort(field, direction = 'asc') {
    let funcCompare;

    if (this.headerConfig.find(obj => obj.id === field).sortable === false) return;
    const sortType = this.headerConfig.find(obj => obj.id === field).sortType;

    if (sortType === 'number') {
      funcCompare = compareNumber;
    }
    if (sortType === 'string') {
      funcCompare = localeCompareRuEnUpperFirst;
    }

    this.data.sort((a, b) => {
      if (direction === 'asc') {
        return funcCompare(a[field], b[field]);
      } else if (direction === 'desc') {
        return funcCompare(b[field], a[field]);
      } else {
        throw 'There is not this sort order.';
      }
    });

    this.subElements.body.innerHTML = this.getColumnBody();
    this.subElements.header.querySelectorAll('[data-order]').forEach(element => {
      element.removeAttribute('data-order');
    });
    this.subElements.header.querySelector('[data-id="' + field + '"]').setAttribute('data-order', direction);

    function localeCompareRuEnUpperFirst(a, b) {
      return a.localeCompare(b, ['ru', 'en'], { caseFirst: "upper" });
    }

    function compareNumber(a, b) {
      return a - b;
    }
  }
}

