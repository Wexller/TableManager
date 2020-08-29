import {getFormData} from '../utils';

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
    this.$el.addEventListener('submit', this.tableSubmitHandler.bind(this.context))
  }

  tableClickHandler(event) {
    const $el = event.target
    const elData = $el.dataset

    switch (elData['type']) {
      case 'pagination':
        this.emitter.emit('tablePagination:click', elData['page'])
        break

      case 'order':
        this.emitter.emit('order:click', elData['code'])
        break

      case 'filter-reset':
        this.emitter.emit('filter:reset')
        break
    }
  }

  tableSubmitHandler(event) {
    event.preventDefault()

    const $el = event.target
    const elData = $el.dataset

    const data = getFormData($el)

    switch (elData['type']) {
      case 'filter':
        this.emitter.emit('filter:submit', data)
        break
    }
  }
}