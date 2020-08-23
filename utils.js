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

export function findGetParameter(parameterName) {
  let result = null
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