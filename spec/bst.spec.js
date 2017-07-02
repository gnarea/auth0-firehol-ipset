/* eslint-env jasmine */

import {makeBalancedBst, binarySearch} from "../src/bst";

describe("BstNode", () => {
    describe("construction", () => {
        it("with empty input", () => {
            expectBalancedBst().toBeNull();
        });

        it("with single key", () => {
            const key = "a";
            const node = makeNode(key);

            expectBalancedBst(key).toEqual(node);
        });

        it("with two keys", () => {
            const key1 = "a";
            const key2 = "b";
            const leftNode = makeNode(key1);
            const node = makeNode(key2, leftNode);

            expectBalancedBst(key1, key2).toEqual(node);
        });

        it("with three keys", () => {
            const key1 = "a";
            const key2 = "b";
            const key3 = "c";
            const leftNode = makeNode(key1);
            const rightNode = makeNode(key3);
            const node = makeNode(key2, leftNode, rightNode);

            expectBalancedBst(key1, key2, key3).toEqual(node);
        });

        it("with more than three keys", () => {
            const key1 = "a";
            const key2 = "b";
            const key3 = "c";
            const key4 = "d";
            const key5 = "e";
            const leftNode = makeNode(key2, makeNode(key1));
            const rightNode = makeNode(key5, makeNode(key4));
            const node = makeNode(key3, leftNode, rightNode);

            expectBalancedBst(key1, key2, key3, key4, key5).toEqual(node);
        });

        it("with unordered keys", () => {
            const key1 = "a";
            const key2 = "b";
            const key3 = "c";
            const leftNode = makeNode(key1);
            const rightNode = makeNode(key3);
            const node = makeNode(key2, leftNode, rightNode);

            expectBalancedBst(key3, key1, key2).toEqual(node);
        });
    });

    describe("search", () => {
        it("with matching key at root", () => {
            const key = "a";
            const node = makeNode(key);

            expect(binarySearch(key, node)).toBeTruthy();
        });

        it("with matching key in left node", () => {
            const key1 = "a";
            const key2 = "b";
            const leftNode = makeNode(key1);
            const node = makeNode(key2, leftNode);

            expect(binarySearch(key1, node)).toBeTruthy();
        });

        it("with matching key in right node", () => {
            const key1 = "a";
            const key2 = "b";
            const key3 = "c";
            const leftNode = makeNode(key1);
            const rightNode = makeNode(key3);
            const node = makeNode(key2, leftNode, rightNode);

            expect(binarySearch(key3, node)).toBeTruthy();
        });

        it("with unknown key", () => {
            const node = makeNode("a");

            expect(binarySearch("b", node)).toBeFalsy();
        });
    });
});


// ===== Utilities


function expectBalancedBst(...keys) {
    return expect(makeBalancedBst(keys));
}


function makeNode(key, leftNode=null, rightNode=null) {
    return {k: key, l: leftNode, r: rightNode};
}
