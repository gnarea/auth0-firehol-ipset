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
        bst = {key: keys[medianIndex], left: leftNode, right: rightNode};
    } else {
        bst = null;
    }
    return bst;
}


export function binarySearch(key, bst) {
    let wasKeyFound;
    if (!bst) {
        wasKeyFound = false;
    } else if (key === bst.key) {
        wasKeyFound = true;
    } else if (key < bst.key) {
        wasKeyFound = binarySearch(key, bst.left);
    } else {
        wasKeyFound = binarySearch(key, bst.right);
    }
    return wasKeyFound;
}
