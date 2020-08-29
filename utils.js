/**
 * Make array of chunks from array
 * @param {Array} array
 * @param {Number} size
 * @returns Array[]
 */
export function arrayChunks(array, size = 1) {
  const result = []
  size = Math.floor(+size)

  if (size > 0) {
    for (let i = 0; i < array.length; i += size) {
      if (i + size <= array.length) {
        result.push(array.slice(i, i + size))
      } else {
        result.push(array.slice(i, array.length))
      }
    }
  }

  return result
}

/**
 * Search get parameter in query string
 * @param {string} parameterName
 * @return {string}
 */
export function findGetParameter(parameterName) {
  let result = ''
  let tmp = []

  location.search
    .substr(1)
    .split("&")
    .forEach(function (item) {
      tmp = item.split("=")
      if (tmp[0] === parameterName) {
        result = decodeURIComponent(tmp[1])
      }
    })

  return result
}

/**
 * Return form data values
 * @param {object} obj
 * @return {object}
 */
export function getFormData(obj) {
  return Object
    .values(obj)
    .reduce((res, field) => {
      if (!field.name || !field.value) {
        return res
      }

      if (field.type === 'radio') {
        if (field.checked && !res[field.name]) {
          res[field.name] = field.value
        }
      } else {
        res[field.name] = field.value
      }
      return res
    }, {})
}

/**
 * Returns true if str1 contains str2
 * @param {string} str1
 * @param {string} str2
 * @return {boolean}
 */
export function isStringIncludesSubstring(str1, str2) {
  return !!str1.toLowerCase().includes(str2.toLowerCase())
}