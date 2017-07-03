import BluebirdPromise from "bluebird";
import express from "express";
import S3 from "aws-sdk/clients/s3";
import {AUTH0_IPSET_OBJECT_PARAMS} from "./auth0-ipset-conf";
import {findIpAddressInBst} from "./firehol-iplists";


const app = express();

let BST;


app.get("/", function (req, res) {
    if (req.query.ip) {
        if (findIpAddressInBst(req.query.ip, BST)) {
            res.status(204).send("");
        } else {
            res.status(404).send("");
        }
    } else {
        res.status(400).json({error: "No IP address was queried"});
    }
});


const s3 = new S3();
const s3GetObjectPromisified =
    BluebirdPromise.promisify(s3.getObject, {context: s3});
s3GetObjectPromisified(AUTH0_IPSET_OBJECT_PARAMS)
    .then((objectData) => {
        BST = JSON.parse(objectData.Body);

        app.listen(8080, () => console.log("Listening on port 8080"));
    })
    .catch((error) => console.error(error));
