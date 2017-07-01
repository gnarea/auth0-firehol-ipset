/* eslint-env jasmine */

import {makeBalancedBst, BstNode} from "../src/bst";

describe("BstNode", () => {
    describe("construction", () => {
        it("with empty input", () => {
            expectBalancedBst().toBeNull();
        });

        it("with single key", () => {
            const key = "a";
            const node = new BstNode(key, null, null);

            expectBalancedBst(key).toEqual(node);
        });

        it("with two keys", () => {
            const key1 = "a";
            const key2 = "b";
            const leftNode = new BstNode(key1, null, null);
            const node = new BstNode(key2, leftNode, null);

            expectBalancedBst(key1, key2).toEqual(node);
        });

        it("with three keys", () => {
            const key1 = "a";
            const key2 = "b";
            const key3 = "c";
            const leftNode = new BstNode(key1, null, null);
            const rightNode = new BstNode(key3, null, null);
            const node = new BstNode(key2, leftNode, rightNode);

            expectBalancedBst(key1, key2, key3).toEqual(node);
        });

        it("with more than three keys", () => {
            const key1 = "a";
            const key2 = "b";
            const key3 = "c";
            const key4 = "d";
            const key5 = "e";
            const leftNode =
                new BstNode(key2, new BstNode(key1, null, null), null);
            const rightNode =
                new BstNode(key5, new BstNode(key4, null, null), null);
            const node = new BstNode(key3, leftNode, rightNode);

            expectBalancedBst(key1, key2, key3, key4, key5).toEqual(node);
        });

        it("with unordered keys", () => {
            const key1 = "a";
            const key2 = "b";
            const key3 = "c";
            const leftNode = new BstNode(key1, null, null);
            const rightNode = new BstNode(key3, null, null);
            const node = new BstNode(key2, leftNode, rightNode);

            expectBalancedBst(key3, key1, key2).toEqual(node);
        });
    });
});


// ===== Utilities


function expectBalancedBst(...keys) {
    return expect(makeBalancedBst(...keys));
}
