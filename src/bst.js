export function makeBalancedBst(...keys) {
    keys.sort();
    return makeBst(keys);
}


function makeBst(keys) {
    let bst;
    if (keys.length) {
        const medianIndex = Math.floor(keys.length / 2);
        const leftNode = makeBst(keys.slice(0, medianIndex));
        const rightNode = makeBst(keys.slice(medianIndex + 1));
        bst = {value: keys[medianIndex], left: leftNode, right: rightNode};
    } else {
        bst = null;
    }
    return bst;
}
