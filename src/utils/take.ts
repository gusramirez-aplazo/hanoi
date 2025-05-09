function* take<T>(n: number, iterable: Iterable<T>): Generator<T> {
  for (let i of iterable) {
    if (n <= 0) {
      return
    }

    n--

    yield i
  }
}

export { take }
