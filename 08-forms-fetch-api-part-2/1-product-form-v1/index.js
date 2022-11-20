import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  save = (event) => {
    const nameCustomEvent = this.isNewProduct ? 'product-saved' : 'product-updated';
    this.element.dispatchEvent(new CustomEvent(nameCustomEvent, {
      bubbles: true
    }));
  }

  constructor(productId) {
    this.productId = productId;
    this.isNewProduct = !productId;

    this.urlCategory = new URL('api/rest/categories', BACKEND_URL);
    this.urlCategory.searchParams.set('_sort', 'weight');
    this.urlCategory.searchParams.set('_refs', 'subcategory');

    this.urlProduct = new URL('api/rest/products', BACKEND_URL);

    this.urlProductGet = new URL('api/rest/products', BACKEND_URL);
    this.urlProductGet.searchParams.set('id', this.productId);
  }

  async render() {
    const element = document.createElement("div");
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;

    this.subElements = this.getSubElements();

    this.loadData();

    this.initEventListener();

    this.subElements.productForm.action = this.urlProduct.href;
    this.subElements.productForm.method = this.isNewProduct ? 'PUT' : 'PATCH';

    return this.element;
  }

  getTemplate() {
    return `
      <div class="product-form">
        <form data-element="productForm" class="form-grid">
          <div class="form-group form-group__half_left">
            <fieldset>
              <label class="form-label">Название товара</label>
              <input required="" type="text" name="title" id="title" class="form-control" placeholder="Название товара">
            </fieldset>
          </div>
          <div class="form-group form-group__wide">
            <label class="form-label">Описание</label>
            <textarea required="" class="form-control" name="description" id="description" data-element="productDescription" placeholder="Описание товара"></textarea>
          </div>
          <div class="form-group form-group__wide" data-element="sortable-list-container">
            <label class="form-label">Фото</label>
              <div data-element="imageListContainer">
              </div>
              <button type="button" name="uploadImage" class="button-primary-outline">
                <span>Загрузить (coming soon..)</span>
              </button>
          </div>
          <div class="form-group form-group__half_left">
            <label class="form-label">Категория</label>
            <select class="form-control" name="subcategory" id="subcategory">
            </select>
          </div>
          <div class="form-group form-group__half_left form-group__two-col">
            <fieldset>
              <label class="form-label">Цена ($)</label>
              <input required="" type="number" name="price" id="price" class="form-control" placeholder="100">
            </fieldset>
            <fieldset>
              <label class="form-label">Скидка ($)</label>
              <input required="" type="number" name="discount" id="discount" class="form-control" placeholder="0">
            </fieldset>
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Количество</label>
            <input required="" type="number" class="form-control" name="quantity" id="quantity" placeholder="1">
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Статус</label>
            <select class="form-control" name="status" id="status">
              <option value="1">Активен</option>
              <option value="0">Неактивен</option>
            </select>
          </div>
          <div class="form-buttons">
            <button type="submit" name="save" class="button-primary-outline">
              ${this.isNewProduct ? 'Добавить товар' : 'Сохранить товар'}
            </button>
          </div>
        </form>
      </div>
      `
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

  async loadData() {
    if (this.isNewProduct) {
      this.resultCategory = await fetchJson(this.urlCategory);
      this.subElements.productForm.elements.price.value = 100;
      this.subElements.productForm.elements.discount.value = 0;
      this.subElements.productForm.elements.quantity.value = 1;
    } else {
      [this.resultCategory, this.resultProduct] = await Promise.all([fetchJson(this.urlCategory), fetchJson(this.urlProductGet)]);
    }

    this.updateData();
  }

  updateData() {
    if (this.resultCategory) {
      for (const category of this.resultCategory) {
        for (const subCategory of category.subcategories) {
          let newOption = new Option(`${category.title} > ${subCategory.title}`, subCategory.id);
          this.subElements.productForm.elements.subcategory.append(newOption);
        }
      }
    }

    if (this.resultProduct) {
      this.subElements.productForm.elements.title.value = this.resultProduct[0].title;
      this.subElements.productForm.elements.description.value = this.resultProduct[0].description;
      this.subElements.productForm.elements.price.value = this.resultProduct[0].price;
      this.subElements.productForm.elements.discount.value = this.resultProduct[0].discount;
      this.subElements.productForm.elements.quantity.value = this.resultProduct[0].quantity;
      this.subElements.productForm.elements.status.value = this.resultProduct[0].status;
      this.subElements.productForm.elements.subcategory.value = this.resultProduct[0].subcategory;
      this.subElements.imageListContainer.innerHTML = this.loadImages();
    }

  }

  loadImages() {
    return '<ul class="sortable-list">' +
      this.resultProduct[0].images
        .map(item => {
          return `
          <li class="products-edit__imagelist-item sortable-list__item" style="">
          <input type="hidden" name="url" value="${item.url}">
          <input type="hidden" name="source" value="${item.source}">
          <span>
            <img src="icon-grab.svg" data-grab-handle="" alt="grab">
            <img class="sortable-table__cell-img" alt="Image" src="${item.url}">
            <span>${item.source}</span>
          </span>
          <button type="button">
            <img src="icon-trash.svg" data-delete-handle="" alt="delete">
          </button>
          </li>
      `
        })
        .join("") +
      '</ul>';
  }

  initEventListener() {
    this.subElements.productForm.addEventListener('submit', this.save);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }

}
