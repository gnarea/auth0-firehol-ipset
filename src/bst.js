export class BstNode {
    constructor(value, left_node, right_node) {
        this.value = value;
        this.left_node = left_node;
        this.right_node = right_node;
    }
}


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
        bst = new BstNode(keys[medianIndex], leftNode, rightNode);
    } else {
        bst = null;
    }
    return bst;
}
