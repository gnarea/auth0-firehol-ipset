const AUTH0_IPSET_BUCKET =
    process.env.AUTH0_IPSET_BUCKET || "auth0-firehol-ipset";

const AUTH0_IPSET_OBJECT_KEY = process.env.AUTH0_IPSET_OBJECT_KEY || "bst.json";

export const AUTH0_IPSET_OBJECT_PARAMS = {
    Bucket: AUTH0_IPSET_BUCKET,
    Key: AUTH0_IPSET_OBJECT_KEY,
};
