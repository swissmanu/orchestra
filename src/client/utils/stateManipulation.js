
export function extend (...targets) {
  return Object.assign.apply(this, [{}].concat(targets))
}

export function replaceItemAtIndex (array, index, newItem) {
  return [
    ...array.slice(0, index),
    newItem,
    ...array.slice(index + 1)
  ]
}
