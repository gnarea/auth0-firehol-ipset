import BluebirdPromise from "bluebird";
import S3 from "aws-sdk/clients/s3";
import {buildBstFromIplist, mergeIplistsFromUrls} from "./firehol-iplists";
import {AUTH0_IPSET_OBJECT_PARAMS} from "./auth0-ipset-conf";


const IPLIST_URLS = [
    "https://raw.githubusercontent.com/firehol/blocklist-ipsets/master/firehol_anonymous.netset",
    "https://raw.githubusercontent.com/firehol/blocklist-ipsets/master/firehol_abusers_1d.netset",
    "https://raw.githubusercontent.com/firehol/blocklist-ipsets/master/firehol_level2.netset",
];


export function main() {
    mergeIplistsFromUrls(IPLIST_URLS)
        .then(buildBstFromIplist)
        .then(JSON.stringify)
        .then(saveStringToS3)
        .then(() => console.log("Update was successfully completed"))
        .catch((error) => console.error(error));
}


function saveStringToS3(string) {
    const s3 = new S3();
    const s3PutObjectPromisified =
        BluebirdPromise.promisify(s3.putObject, {context: s3});
    const objectParams =
        Object.assign({}, AUTH0_IPSET_OBJECT_PARAMS, {Body: string});
    return s3PutObjectPromisified(objectParams);
}


main();