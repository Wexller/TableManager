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
    this.items = options['items'] || []

    this.#initSubscribers()

    this.#initHeaderTitles(options)

    this.showPagination = !!options['pagination']
    this.#initPagination(options)

    this.showOrder = !!options['order']
    this.#initOrder(options)

    this.showFilter = !!options['filter']
    this.#initFilter(options)

    this.#render()

    this.domListener = new TableDomListener({
      $el: this.$el,
      emitter: this.emitter
    })
  }

  #initHeaderTitles(options) {
    this.header = {}
    // Write header from options or from items
    if (options['header']) {
      Object.keys(options['header']).forEach(key => {
        this.header[key] = {
          title: options['header'][key]['title'] || key,
          width: options['header'][key]['width'] || 'auto'
        }
      })
    } else if (this.items.length) {
      Object.keys(this.items[0]).forEach(key => {
        this.header[key] = {
          title: key,
          width: 'auto'
        }
      })
    }

    this.headerTitles = {}
    Object.keys(this.header).forEach(key => this.headerTitles[key] = this.header[key]['title'])
    this.headerCodes = Object.keys(this.headerTitles)
  }

  #initOrder(options) {
    if (this.showOrder) {
      this.orderCodes = Object.keys(options['order']) || []
      this.tableOrder = new TableOrder({emitter: this.emitter, order: options['order']})
    }
  }

  #initFilter(options) {
    if (this.showFilter) {
      this.filterCodes = options['filter']
      this.tableFilter = new TableFilter({
        emitter: this.emitter,
        filter: options['filter'],
        header: this.headerTitles
      })
    }
  }

  #initPagination(options) {
    if (this.showPagination) {
      const paginationOptions = {
        active: options['pagination'],
        currentPage: options['currentPage'] || +findGetParameter('page'),
        itemsPerPage: options['itemsPerPage'] || this.items.length,
        pageCount: options['pagination']
          ? Math.ceil(this.items.length / options['itemsPerPage'])
          : this.items.length,
        emitter: this.emitter
      }

      this.tablePagination = new TablePagination(paginationOptions)
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
      <div class="row">
        <div class="${this.showFilter ? 'col-9' : 'col-12'}">
          ${this.#getTable()}
          ${this.showPagination && this.#isPaginationNecessary(this.items) ? this.tablePagination.getPagination() : ''}
        </div>       
        ${this.showFilter ? this.tableFilter.getFilterBlock() : ''}         
      </div>      
    `
  }

  /**
   * Returns table template
   * @return {string}
   */
  #getTable() {
    return `
      <table class="table">
        <thead><tr>${this.#getTableHeader()}</tr></thead>
        <tbody>${this.#getTableBody()}</tbody>
      </table>`
  }

  /**
   *
   * @returns {String}
   */
  #getTableHeader() {
    return this.headerCodes.length
      ? this.headerCodes.map(key => this.#getHeaderCell(key)).join('')
      : ''
  }

  /**
   *
   * @param {string} key
   * @return {string}
   */
  #getHeaderCell(key) {
    return `<th scope="col" style="width: ${this.header[key]['width']}">
              ${this.headerTitles[key]}${this.#getHeaderOrderIcon(key)}
            </th>`
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
    return this.showOrder && this.orderCodes.includes(code)
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
    const items = this.showFilter ? this.#filterItems() : [...this.items]
    this.#sortItems()

    if (this.showPagination) {
      const chunks = this.#getArrayChunks(items)
      this.tablePagination.pageCount = chunks.length
      const page = this.tablePagination.getCurrentPage() - 1

      if (this.#isPaginationNecessary(items)) {
        return chunks[page].map(item => `<tr>${this.#getTableItem(item)}</tr>`).join('')
      } else {
        chunks.map(item => `<tr>${this.#getTableItem(item)}</tr>`).join('')
      }
    }

    return items.map(item => `<tr>${this.#getTableItem(item)}</tr>`).join('')
  }

  /**
   * Returns chunks if tablePagination necessary
   * @param {array} array
   * @return {array}
   */
  #getArrayChunks(array) {
    return this.#isPaginationNecessary(array)
      ? arrayChunks(array, this.tablePagination.itemsPerPage)
      : array
  }

  /**
   * Check if tablePagination necessary
   * @param {array} array
   * @return {boolean}
   */
  #isPaginationNecessary(array) {
    return array.length > this.tablePagination.itemsPerPage
  }

  /**
   * Filter items and returns new array
   * @return {[]}
   */
  #filterItems() {
    let items = []
    if (this.showFilter) {
      items = this.items.filter(this.tableFilter.getFilterFunction())
    }

    return items
  }

  /**
   * Sort items if showOrder is true
   */
  #sortItems() {
    if (this.showOrder) {
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