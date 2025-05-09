function* take(n, iterable) {
    for (let i of iterable) {
        if (n <= 0) {
            return;
        }
        n--;
        yield i;
    }
}
export { take };
