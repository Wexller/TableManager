export class TableOrder {
  constructor(options) {
    this.isOrderAsc = true
    this.context = this
    this.orderCode = ''
    this.emitter = options['emitter']
    this.orderBy = options['order'] || {}

    this.emitter.subscribe('order:click', this.#orderClickHandler.bind(this.context))
  }

  /**
   * Returns sort function based on order options
   * @return {function}
   */
  getOrderFunction() {
    switch (this.orderBy[this.orderCode]) {
      case 'number':
        return this.#orderByNumber.bind(this.context)

      case 'text':
        return this.#orderByText.bind(this.context)
    }
  }

  #orderByText(a, b) {
    const item1 = `${a[this.orderCode]}`
    const item2 = `${b[this.orderCode]}`

    return this.isOrderAsc ? item2.localeCompare(item1) : item1.localeCompare(item2)
  }

  #orderByNumber(a, b) {
    const item1 = +a[this.orderCode]
    const item2 = +b[this.orderCode]
    return this.isOrderAsc ? item2 - item1 : item1 - item2
  }

  #orderClickHandler(code) {
    this.#setDirection(code)
    this.orderCode = code
    this.emitter.emit('page:change')
  }

  /**
   * Set sort direction. If code changed, then direction sets default
   * @param {string} code
   */
  #setDirection(code) {
    if (this.orderCode !== code) {
      this.isOrderAsc = true
    } else {
      this.isOrderAsc = !this.isOrderAsc
    }
  }
}