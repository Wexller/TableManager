export class TableDomListener {
  constructor(options) {
    const {$el, emitter} = options

    this.$el = $el
    this.emitter = emitter
    this.context = this

    this.#initListeners()
  }

  #initListeners() {
    this.$el.addEventListener('click', this.tableClickHandler.bind(this.context))
  }

  tableClickHandler(event) {
    const $el = event.target
    const elData = $el.dataset

    switch (elData['type']) {
      case 'pagination':
        this.emitter.emit('pagination:click', elData['page'])
        break

      case 'order':
        this.emitter.emit('order:click', elData['code'])
        break
    }
  }
}