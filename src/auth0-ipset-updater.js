import BluebirdPromise from "bluebird";
import S3 from "aws-sdk/clients/s3";
import {buildBstFromIplist, mergeIplistsFromUrls} from "./firehol-iplists";
import {AUTH0_IPSET_BUCKET, AUTH0_IPSET_OBJECT_KEY} from "./auth0-ipset-conf";


const IPLIST_URLS = [
    "https://raw.githubusercontent.com/firehol/blocklist-ipsets/master/firehol_abusers_30d.netset",
    "https://raw.githubusercontent.com/firehol/blocklist-ipsets/master/spamhaus_edrop.netset",
    "https://raw.githubusercontent.com/firehol/blocklist-ipsets/master/firehol_level3.netset",
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
    return s3PutObjectPromisified({
        Bucket: AUTH0_IPSET_BUCKET,
        Key: AUTH0_IPSET_OBJECT_KEY,
        Body: string
    });
}


main();