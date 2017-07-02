export function makeBalancedBst(keys) {
    keys.sort();
    return makeBst(keys);
}


function makeBst(keys) {
    let bst;
    if (keys.length) {
        const medianIndex = Math.floor(keys.length / 2);
        const leftNode = makeBst(keys.slice(0, medianIndex));
        const rightNode = makeBst(keys.slice(medianIndex + 1));
        bst = {k: keys[medianIndex], l: leftNode, r: rightNode};
    } else {
        bst = null;
    }
    return bst;
}


export function binarySearch(key, bst) {
    let wasKeyFound;
    if (!bst) {
        wasKeyFound = false;
    } else if (key === bst.k) {
        wasKeyFound = true;
    } else if (key < bst.k) {
        wasKeyFound = binarySearch(key, bst.l);
    } else {
        wasKeyFound = binarySearch(key, bst.r);
    }
    return wasKeyFound;
}
