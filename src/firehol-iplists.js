import BluebirdPromise from "bluebird";
import requestPromise from "request-promise";


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
