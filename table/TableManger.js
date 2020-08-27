import {TableFilter} from './TableFilter'
import {TableOrder} from './TableOrder'
import {arrayChunks, findGetParameter} from '../utils';
import {TablePagination} from './TablePagination';
import {Emitter} from '../Emitter';
import {TableDomListener} from './TableDomListener';

export class TableManger {
  constructor(selector, options) {
    this.$el = document.querySelector(selector)
    this.emitter = new Emitter()
    this.context = this

    this.#initSubscribers()

    this.items = options['items'] || []
    this.headerTitle = options['header'] && options['header']['title']
      ? options['header']['title']
      : {}
    this.headerCodes = options['header'] && options['header']['codes']
      ? options['header']['codes']
      : {}

    this.usePagination = !!options['pagination']
    this.#initPagination(options)

    this.useOrder = !!options['order']
    this.#initOrder(options)

    this.tableFilter = new TableFilter()

    this.#render()

    this.domListener = new TableDomListener({
      $el: this.$el,
      emitter: this.emitter
    })
  }

  #initOrder(options) {
    if (this.useOrder) {
      this.orderCodes = options['order']['codes'] || []
      this.tableOrder = new TableOrder({emitter: this.emitter, order: options['order']})
    }
  }

  #initPagination(options) {
    if (this.usePagination) {
      const paginationOptions = {
        active: options['pagination'],
        currentPage: options['currentPage'] || +findGetParameter('page'),
        itemsPerPage: options['itemsPerPage'] || this.items.length,
        pageCount: options['pagination']
          ? Math.ceil(this.items.length / options['itemsPerPage'])
          : this.items.length,
        $el: this.$el,
        emitter: this.emitter
      }

      this.pagination = new TablePagination(paginationOptions)
    }
  }

  #initSubscribers() {
    this.emitter.subscribe('page:change', () => this.#render())
  }

  /**
   * Render table
   */
  #render() {
    this.$el.innerHTML = `
      <table class="table">
        <thead><tr>${this.#getTableHeader()}</tr></thead>
        <tbody>${this.#getTableBody()}</tbody>
      </table>
      ${this.usePagination ? this.pagination.getPagination() : ''}
    `
  }

  /**
   *
   * @returns {String}
   */
  #getTableHeader() {
    if (this.headerDisplay && this.headerDisplay.length) {
      return this.headerDisplay
        .map(key => this.#getHeaderCell(key))
        .join('')
    }

    return Object
      .keys(this.headerTitle)
      .map(key => this.#getHeaderCell(key))
      .join('')
  }

  /**
   *
   * @param {string} key
   * @return {string}
   */
  #getHeaderCell(key) {
    return typeof this.headerTitle[key] !== 'undefined'
      ? `<th scope="col">${this.headerTitle[key]}${this.#getHeaderOrderIcon(key)}</th>`
      : ''
  }

  /**
   *
   * @param {string} code
   * @return {string}
   */
  #getHeaderOrderIcon(code) {
    let result = ''
    if (this.#isCodeInOrder(code)) {
      result = `<i class="fa ${this.#getOrderClass(code)} order-items" data-type="order" data-code="${code}"></i>`
    }

    return result
  }

  /**
   *
   * @param code
   * @return {boolean}
   */
  #isCodeInOrder(code) {
    return this.useOrder && this.orderCodes.includes(code)
  }

  /**
   * Returns font awesome icon class
   * @param {string} code
   * @return {string}
   */
  #getOrderClass(code) {
    if (this.tableOrder.orderCode === code) {
      return this.tableOrder.isOrderAsc ? 'fa-sort-asc' : 'fa-sort-desc'
    } else {
      return 'fa-sort'
    }
  }

  /**
   *
   * @returns {String}
   */
  #getTableBody() {
    this.#sortItems()

    if (this.usePagination) {
      const page = (this.pagination.page - 1) <= this.items.length
        ? this.pagination.page - 1
        : this.items.length - 1

      const chunks = arrayChunks(this.items, this.pagination.itemsPerPage)

      return chunks[page]
        .map(item => `<tr>${this.#getTableItem(item)}</tr>`).join('')
    }

    return this.items
      .map(item => `<tr>${this.#getTableItem(item)}</tr>`).join('')
  }

  #sortItems() {
    if (this.useOrder) {
      this.items.sort(this.tableOrder.getOrderFunction())
    }
  }

  /**
   *
   * @param {Object} item
   * @returns {String}
   */
  #getTableItem(item) {
    if (this.headerCodes && this.headerCodes.length) {
      return this.headerCodes
        .map((key, idx) => {
          if (typeof item[key] !== 'undefined') {
            return idx
              ? `<td>${item[key]}</td>`
              : `<th scope="row">${item[key]}</th>`
          }
        })
        .join('')
    }

    return Object
      .keys(item)
      .map((key, idx) => {
        return idx
          ? `<td>${item[key]}</td>`
          : `<th scope="row">${item[key]}</th>`
      })
      .join('')
  }
}