import BluebirdPromise from "bluebird";
import {Address6} from "ip-address";
import CIDR from "ip-cidr";
import requestPromise from "request-promise";
import {binarySearch, makeBalancedBst} from "./bst";


// ===== IP List Fetching


export function fetchIplistFromUrl(url, downloader=requestPromise) {
    // Unfortunately, given the way `request` and `request-promise` export
    // the function, it cannot be spied on with Jasmine, so `downloader`
    // is being used as a workaround for unit testing.
    // https://github.com/mhevery/jasmine-node/issues/250
    return downloader(url)
        .then((iplistRaw) => iplistRaw.split("\n").reduce(addIpAddress, []));
}


function addIpAddress(iplist, value) {
    const ipAddress = value.includes("#") ? "" : value.trim();
    return ipAddress ? iplist.concat([ipAddress]) : iplist;
}


export function mergeIplistsFromUrls(urls, downloader=fetchIplistFromUrl) {
    return BluebirdPromise.reduce(
        urls,
        (iplist, url) => extendIplistFromUrl(iplist, url, downloader),
        []
    ).then((iplist) => [...new Set(iplist)]);
}


function extendIplistFromUrl(iplist, url, downloader) {
    return downloader(url).then((urlIplist) => iplist.concat(urlIplist));
}


// ===== IP Address Lookup


export function buildBstFromIplist(iplist) {
    let iplistDenormalised = [];
    for (const ipaddress of iplist) {
        for (const denormalisedIpaddress of denormaliseIpAddress(ipaddress)) {
            iplistDenormalised.push(makeIpAddressCorrect(denormalisedIpaddress));
        }
    }
    return makeBalancedBst(iplistDenormalised);
}


function denormaliseIpAddress(ipAddress) {
    let denormalisedAddresses;
    if (ipAddress.includes("/")) {
        const cidrBlock = new CIDR(ipAddress);
        denormalisedAddresses = cidrBlock.toArray();
    } else {
        denormalisedAddresses = [ipAddress];
    }
    return denormalisedAddresses;
}


export function findIpAddressInBst(ipAddress, iplistBst) {
    const correctIpAddress = makeIpAddressCorrect(ipAddress);
    return binarySearch(correctIpAddress, iplistBst);
}


function makeIpAddressCorrect(ipAddress) {
    let correctIpAddress;
    if (ipAddress.includes(":")) {
        const ipv6Address = new Address6(ipAddress);
        correctIpAddress = ipv6Address.correctForm();
    } else {
        correctIpAddress = ipAddress;
    }
    return correctIpAddress;
}
