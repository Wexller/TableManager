import {TableFilter} from './TableFilter'
import {TableOrder} from './TableOrder'

export class TableManger {
  constructor(selector, options) {
    const {items, filter, order, header} = options
    this.options = {...options}
    this.tableFilter = new TableFilter()
    this.tableOrder = new TableOrder()
    this.items = items || []
    this.headerTitle = header['title'] || {}
    this.headerDisplay = header['display'] || {}
    this.$el = document.querySelector(selector)

    this.#render()
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