/* eslint-env jasmine */

import BluebirdPromise from "bluebird";
import {Address4} from "ip-address";
import {fetchIplistFromUrl, mergeIplistsFromUrls} from "../src/firehol-iplists";

const STUB_IPLIST_URL =
    "https://raw.githubusercontent.com/firehol/blocklist-ipsets/master/firehol_webserver.netset";

const STUB_IP_ADDRESS_1 = "192.0.2.1";
const STUB_IP_ADDRESS_2 = "192.0.2.2";
const STUB_IP_ADDRESSES = [STUB_IP_ADDRESS_1, STUB_IP_ADDRESS_2];


describe("fetchIplistFromUrl", () => {

    it("with no items", (done) => {
        testIplistFetch("", done, (iplist) => {
            expect(iplist).toEqual([]);
        });
    });

    it("with single item", (done) => {
        testIplistFetch(STUB_IP_ADDRESS_1, done, (iplist) => {
            expect(iplist).toEqual([STUB_IP_ADDRESS_1]);
        });
    });
    it("with multiple items", (done) => {
        const iplistFileContents = STUB_IP_ADDRESSES.join("\n");
        testIplistFetch(iplistFileContents, done, (iplist) => {
            expect(iplist).toEqual(STUB_IP_ADDRESSES);
        });
    });

    it("with line surrounded with whitespace", (done) => {
        const iplistFileContents = STUB_IP_ADDRESSES.join(" \n\t");
        testIplistFetch(iplistFileContents, done, (iplist) => {
            expect(iplist).toEqual(STUB_IP_ADDRESSES);
        });
    });

    it("with comments", (done) => {
        const iplistFileContents = [
            "# Comment",
            " # Comment with leading whitespace",
            STUB_IP_ADDRESS_1,
        ].join("\n");
        testIplistFetch(iplistFileContents, done, (iplist) => {
            expect(iplist).toEqual([STUB_IP_ADDRESS_1]);
        });
    });

    it("with real 'request-promise'", (done) => {
        const fetchPromise = fetchIplistFromUrl(STUB_IPLIST_URL)
            .then((iplist) => {
                iplist.forEach((ipAddressString) => {
                    const ipAddress = new Address4(ipAddressString);
                    expect(ipAddress.isValid()).toBeTruthy();
                });
            });
        finishPromiseTest(fetchPromise, done);
    });
});


describe("mergeIplistsFromUrls", () => {
    it("with no URLs", (done) => {
        testIpsetMerger({}, done, (iplist) => {
            expect(iplist).toEqual([]);
        });
    });

    it("with one URL", (done) => {
        const iplistByUrl = {[STUB_IPLIST_URL]: [STUB_IP_ADDRESS_1]};
        testIpsetMerger(iplistByUrl, done, (iplist) => {
            expect(iplist).toEqual([STUB_IP_ADDRESS_1]);
        });
    });

    it("with multiple URLs", (done) => {
        const iplistByUrl = {
            [STUB_IPLIST_URL]: STUB_IP_ADDRESS_1,
            "http://example.com/ips": STUB_IP_ADDRESS_2,
        };
        testIpsetMerger(iplistByUrl, done, (iplist) => {
            expect(iplist).toEqual(STUB_IP_ADDRESSES);
        });
    });

    it("with overlapping IP addresses", (done) => {
        const iplistByUrl = {
            [STUB_IPLIST_URL]: STUB_IP_ADDRESSES,
            "http://example.com/ips": STUB_IP_ADDRESS_2,
        };
        testIpsetMerger(iplistByUrl, done, (iplist) => {
            expect(iplist).toEqual(STUB_IP_ADDRESSES);
        });
    });
});


// ===== Test utilities


function testIplistFetch(iplistFileContents, done, callback) {
    const downloaderSpy = jasmine.createSpy("downloader")
        .and.returnValue(BluebirdPromise.resolve(iplistFileContents));
    const fetchPromise = fetchIplistFromUrl(STUB_IPLIST_URL, downloaderSpy)
        .then((iplist) => {
            expect(downloaderSpy).toHaveBeenCalledWith(STUB_IPLIST_URL);
            callback(iplist);
        });
    finishPromiseTest(fetchPromise, done);
}


function testIpsetMerger(iplistByUrl, done, callback) {
    const downloaderSpy = jasmine.createSpy("downloader").and.callFake(
        (url) => BluebirdPromise.resolve(iplistByUrl[url])
    );
    const iplistUrls = Object.keys(iplistByUrl);
    const mergerPromise = mergeIplistsFromUrls(iplistUrls, downloaderSpy)
        .then((iplist) => {
            iplistUrls.forEach((url) => {
                expect(downloaderSpy).toHaveBeenCalledWith(url);
            });
            callback(iplist);
        });
    finishPromiseTest(mergerPromise, done);
}


function finishPromiseTest(promise, done) {
    promise
        .catch((error) => fail(error))
        .finally(() => done());
}
