export class TableOrder {
  constructor(options) {
    this.isOrderAsc = true
    this.context = this
    this.orderCode = ''
    this.emitter = options['emitter']
    this.orderBy = options['order']['by'] || {}

    this.emitter.subscribe('order:click', this.#orderClickHandler.bind(this.context))
  }

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

    return this.isOrderAsc ? item1.localeCompare(item2) : item2.localeCompare(item1)
  }

  #orderByNumber(a, b) {
    const item1 = +a[this.orderCode]
    const item2 = +b[this.orderCode]
    return this.isOrderAsc ? item1 - item2 : item2 - item1
  }

  #orderClickHandler(code) {
    this.#setDirection(code)

    this.orderCode = code
    this.emitter.emit('page:change')
  }

  #setDirection(code) {
    if (this.orderCode !== code) {
      this.isOrderAsc = true
    } else {
      this.isOrderAsc = !this.isOrderAsc
    }
  }
}