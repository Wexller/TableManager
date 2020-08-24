export class TablePagination {
  constructor(options) {
    const {active, currentPage, itemsPerPage, pageCount, emitter, $el} = options

    this.active = active || false
    this.itemsPerPage = itemsPerPage
    this.page = (currentPage >= 1 && currentPage <= pageCount) ? currentPage : 1
    this.pageCount = pageCount
    this.emitter = emitter
    this.$el = $el

    this.emitter.subscribe('pagination:click', page => this.#paginationClickController(page))
  }

  /**
   * Returns HTML previews button
   * @return {string}
   */
  #getPreviewsButton() {
    return `
      <li class="page-item ${this.page === 1 ? 'disabled' : ''}">
        <a class="page-link" data-page="prev" data-type="pagination">&laquo;</a>
      </li>`
  }

  /**
   * Returns HTML next button
   * @return {string}
   */
  #getNextButton() {
    return `
      <li class="page-item ${this.page === this.pageCount ? 'disabled' : ''}">
        <a class="page-link" data-page="next" data-type="pagination">&raquo;</a>
      </li>
    `
  }

  /**
   * Returns HTML page buttons
   * @return {string}
   */
  #getPageButtons() {
    return Array(this.pageCount)
      .fill('')
      .map((_, idx) => {
        return `<li class="page-item ${idx + 1 === this.page ? 'active' : ''}">
                  <a class="page-link" data-page="${idx + 1}" data-type="pagination">${idx + 1}</a>
                </li>`
      })
      .join('')
  }

  /**
   * Change current page
   * @param {String} page
   */
  #paginationClickController(page) {
    let pageChanged = false

    switch (page) {
      case 'prev':
        if (this.page - 1 > 0) {
          this.page -= 1
          pageChanged = true
        }
        break

      case 'next':
        if (this.page + 1 <= this.pageCount) {
          this.page += 1
          pageChanged = true
        }
        break

      default:
        this.page = +page
        pageChanged = true
        break
    }

    if (pageChanged) {
      this.emitter.emit('page:change')
    }
  }

  /**
   * Returns HTML pagination
   * @return {string}
   */
  getPagination() {
    if (this.active) {
      return `
      <nav>
        <ul class="pagination justify-content-center">
          ${this.#getPreviewsButton()}
          ${this.#getPageButtons()}
          ${this.#getNextButton()}
        </ul>
      </nav>`
    }

    return ''
  }
}