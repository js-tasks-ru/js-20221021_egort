import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {
    element;
    subElements;

    range;
    rangePicker;

    orders;
    columnChartOrders;

    sales;
    columnChartSales;

    customers;
    columnChartCustomers;

    bestSellers;
    sortableTableBestSellers;

    constructor() {
        this.monthRangeDefault = 1;
        this.range = {
            to: new Date(),
            from: new Date(),
        };
        this.range.from.setMonth(this.range.from.getMonth() - this.monthRangeDefault);
        this.rangePicker = new RangePicker(this.range);

        this.orders = {
            label: 'orders',
            link: '/sales',
            formatHeading: data => data,
            url: 'api/dashboard/orders',
            range: this.rangePicker.selected,
        };
        this.columnChartOrders = new ColumnChart(this.orders);

        this.sales = {
            label: 'sales',
            formatHeading: data => {
                return '$' + data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },
            url: 'api/dashboard/sales',
            range: this.rangePicker.selected,
        };
        this.columnChartSales = new ColumnChart(this.sales);

        this.customers = {
            label: 'customers',
            formatHeading: data => data,
            url: 'api/dashboard/customers',
            range: this.rangePicker.selected,
        }
        this.columnChartCustomers = new ColumnChart(this.customers);

        this.bestSellers = {
            url: `api/dashboard/bestsellers?from=${this.rangePicker.selected.from.toISOString()}&to=${this.rangePicker.selected.to.toISOString()}`,
            isSortLocally: true,
        };
        this.sortableTableBestSellers = new SortableTable(header, this.bestSellers);
    }

    async render() {
        const element = document.createElement("div");
        element.innerHTML = this.getTemplate();
        this.element = element.firstElementChild;

        this.subElements = this.getSubElements();

        this.subElements.rangePicker.append(this.rangePicker.element);
        this.subElements.ordersChart.append(this.columnChartOrders.element);
        this.subElements.salesChart.append(this.columnChartSales.element);
        this.subElements.customersChart.append(this.columnChartCustomers.element);
        this.subElements.sortableTable.append(this.sortableTableBestSellers.element);

        this.initEventListener();

        return this.element;
    }

    getTemplate() {
        return `
          <div class="dashboard">
            <div class="content__top-panel">
              <h2 class="page-title">Dashboard</h2>
              <!-- RangePicker component -->
              <div data-element="rangePicker"></div>
            </div>
            <div data-element="chartsRoot" class="dashboard__charts">
              <!-- column-chart components -->
              <div data-element="ordersChart" class="dashboard__chart_orders"></div>
              <div data-element="salesChart" class="dashboard__chart_sales"></div>
              <div data-element="customersChart" class="dashboard__chart_customers"></div>
            </div>

            <h3 class="block-title">Best sellers</h3>

            <div data-element="sortableTable">
            <!-- sortable-table component -->
            </div>
          </div>
        `;
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

    initEventListener() {
        this.subElements.rangePicker.addEventListener('date-select', this.onDateSelect);
    }

    onDateSelect = async (event) => {
        this.columnChartOrders.loadData(event.detail.from, event.detail.to);
        this.columnChartSales.loadData(event.detail.from, event.detail.to);
        this.columnChartCustomers.loadData(event.detail.from, event.detail.to);

        this.sortableTableBestSellers.url.searchParams.set('from', event.detail.from.toISOString());
        this.sortableTableBestSellers.url.searchParams.set('to', event.detail.to.toISOString());
        const data = await this.sortableTableBestSellers.loadData(this.sortableTableBestSellers.sorted.id, this.sortableTableBestSellers.sorted.order);
        this.sortableTableBestSellers.renderRows(data);
    }

    remove() {
        if (this.element) {
            this.element.remove();
        }
    }

    destroy() {
        this.remove();
        this.element = null;
        this.rangePicker = null;
        this.sortableTableBestSellers = null;
        this.columnChartOrders = null;
        this.columnChartSales = null;
        this.columnChartCustomers = null;
        this.subElements = {};
    }
}
