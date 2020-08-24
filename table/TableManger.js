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

    const {items, filter, order, header, pagination, currentPage, itemsPerPage} = options
    this.options = {...options}
    this.tableFilter = new TableFilter()
    this.tableOrder = new TableOrder()

    const paginationOptions = {
      active: pagination,
      currentPage: currentPage || +findGetParameter('page'),
      itemsPerPage: itemsPerPage || items.length,
      pageCount: pagination ? Math.ceil(items.length / itemsPerPage) : items.length,
      $el: this.$el,
      emitter: this.emitter
    }

    this.#initSubscribers()

    this.pagination = pagination
      ? new TablePagination(paginationOptions)
      : false

    this.items = this.#getItems(items)
    this.headerTitle = header['title'] || {}
    this.headerDisplay = header['display'] || {}

    this.#render()

    this.domListener = new TableDomListener({
      $el: this.$el,
      emitter: this.emitter
    })
  }

  /**
   *
   * @param {Array} items
   * @return {Array}
   */
  #getItems(items) {
    let result = []

    if (items && items.length) {
      result = this.pagination.active
        ? arrayChunks(items, this.pagination.itemsPerPage)
        : items
    }

    return result
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
      ${this.pagination ? this.pagination.getPagination() : ''}
    `
  }

  /**
   *
   * @returns {String}
   */
  #getTableHeader() {
    if (this.headerDisplay && this.headerDisplay.length) {
      return this.headerDisplay
        .map(key => {
          if (typeof this.headerTitle[key] !== 'undefined') {
            return `<th scope="col">${this.headerTitle[key]}</th>`
          }
        })
        .join('')
    }

    return Object
      .keys(this.headerTitle)
      .map(key => `<th scope="col">${this.headerTitle[key]}</th>`)
      .join('')
  }

  /**
   *
   * @returns {String}
   */
  #getTableBody() {
    if (this.pagination) {
      const page = (this.pagination.page - 1) <= this.items.length
        ? this.pagination.page - 1
        : this.items.length - 1

      return this.items[page]
        .map(item => {
          return `<tr>${this.#getTableItem(item)}</tr>`
        }).join('')
    }

    return this.items
      .map(item => {
        return `<tr>${this.#getTableItem(item)}</tr>`
      }).join('')
  }

  /**
   *
   * @param {Object} item
   * @returns {String}
   */
  #getTableItem(item) {
    if (this.headerDisplay && this.headerDisplay.length) {
      return this.headerDisplay
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