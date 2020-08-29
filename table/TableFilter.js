import {isStringIncludesSubstring} from '../utils';

export class TableFilter {
  constructor(options) {
    this.context = this
    this.filterCodes = options['filter'] || []
    this.emitter = options['emitter']
    this.tableHeader = options['header'] || {}

    this.emitter.subscribe('filter:submit', this.#filterSubmitHandler.bind(this.context))
    this.emitter.subscribe('filter:reset', this.#filterResetHandler.bind(this.context))

    this.#setFormDataDefaults()
  }

  /**
   * Returns function for filter based on chosen logic (AND|OR)
   * @return {function}
   */
  getFilterFunction() {
    switch (this.logic) {
      case 'and':
          return this.#filterLogicAnd.bind(this.context)

      case 'or':
        return this.#filterLogicOr.bind(this.context)
    }
  }

  getFilterBlock() {
    return ` 
      <div class="col-3">
        <div class="card">
          <div class="card-header">
            Фильтр
          </div>
          <div class="card-body">
            <form data-type="filter">
              ${this.#getFilterParams()}              
              ${this.#getLogicSwitchTemplate()}
              <div class="d-flex justify-content-between">
                <button type="submit" class="btn btn-primary">Применить</button>
                <button data-type="filter-reset" class="btn btn-secondary">Сброс</button>
              </div>              
            </form>
          </div>          
        </div>
      </div>`
  }

  #filterLogicAnd(item) {
    let result = true
    for (const key of this.formDataKeys) {
      if (!isStringIncludesSubstring(`${item[key]}`, this.formData[key])) {
        return false
      }
    }
    return result
  }

  #filterLogicOr(item) {
    let result = false
    for (const key of this.formDataKeys) {
      if (isStringIncludesSubstring(`${item[key]}`, this.formData[key])) {
        return true
      }
    }
    return result
  }

  #getFilterParams() {
    return this.filterCodes.length
      ? this.filterCodes.map(code => this.#getFilterParam(code)).join('')
      : 'Поля для фильтра не выбраны'
  }

  #getFilterParam(code) {
    return this.tableHeader[code]
      ? this.#getParamTemplate(code, this.tableHeader[code])
      : ''
  }

  #getParamTemplate(code, title) {
    return `
      <div class="form-group">
        <label class="input-label" for="filter__${title}">${title}</label>
        <input 
          type="text" 
          class="form-control" 
          id="filter__${title}" 
          name="${code}"
          value="${this.formData[code] || ''}">
      </div>
    `
  }

  #getLogicSwitchTemplate() {
    return `
      <div class="form-check">
        <input class="form-check-input" 
          type="radio" 
          name="logic" 
          id="filter__logic-and" 
          value="and" ${this.logic === 'and' ? 'checked' : ''}>
        <label class="form-check-label" for="filter__logic-and">
          Логика &laquo;И&raquo; (AND)
        </label>
      </div>
      <div class="form-check mb-3">
        <input class="form-check-input" 
          type="radio" 
          name="logic" 
          id="filter__logic-or" 
          value="or" ${this.logic === 'or' ? 'checked' : ''}>
        <label class="form-check-label" for="filter__logic-or">
          Логика &laquo;ИЛИ&raquo; (OR)
        </label>
      </div>
    `
  }

  /**
   * Sets data from form
   * @param {object} formData
   */
  #filterSubmitHandler(formData) {
    const data = {...formData}

    this.logic = data['logic']
    delete data['logic']

    this.formData = data
    this.formDataKeys = Object.keys(data)

    this.emitter.emit('page:change')
  }

  #filterResetHandler() {
    this.#setFormDataDefaults()
    this.emitter.emit('page:change')
  }

  /**
   * Reset all form data
   */
  #setFormDataDefaults() {
    this.logic = 'and'
    this.formData = {}
    this.formDataKeys = []
  }
}