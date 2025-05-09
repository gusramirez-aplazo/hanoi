import { take } from '../utils/take.js';
function* hanoiBinarySolution(args) {
    const { numDisks, totalMoves, sourceName = '1', auxName = '2', destName = '3', } = args;
    if (numDisks <= 0) {
        yield { disk: 0, from: null, to: null };
    }
    const pegNames = [sourceName, auxName, destName];
    for (let m = 1; m <= totalMoves; m++) {
        const diskToMove = Math.log2(m & -m) + 1;
        let fromPegNum = (m & (m - 1)) % 3;
        let toPegNum = ((m | (m - 1)) + 1) % 3;
        if (numDisks % 2 === 0) {
            if (fromPegNum === 1) {
                fromPegNum = 2;
            }
            else if (fromPegNum === 2) {
                fromPegNum = 1;
            }
            if (toPegNum === 1) {
                toPegNum = 2;
            }
            else if (toPegNum === 2) {
                toPegNum = 1;
            }
        }
        const fromActualName = pegNames[fromPegNum];
        const toActualName = pegNames[toPegNum];
        yield {
            disk: diskToMove,
            from: fromActualName ?? null,
            to: toActualName ?? null,
        };
    }
}
const solveWithTiming = async (args) => {
    const { disks, isTruncated = true, origin, helper, destiny } = args;
    const totalMoves = Math.pow(2, disks) - 1;
    const start = performance.now();
    const solution = [
        ...take(isTruncated ? 100 : totalMoves, hanoiBinarySolution({
            numDisks: disks,
            totalMoves,
            sourceName: origin,
            auxName: helper,
            destName: destiny,
        })),
    ];
    const end = performance.now();
    return {
        totalMoves,
        time: end - start,
        solution,
    };
};
export { hanoiBinarySolution, solveWithTiming };
