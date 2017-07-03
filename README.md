# auth0-firehol-ipset

Service to look up IP addresses in a predetermined subset of [IP Lists by
the FireHOL team](http://iplists.firehol.org/).

See [design document](https://docs.google.com/document/d/1hPa-LLRRdGHXR21bzYocx0FCbNFydkWvHRFZVylSqs0/edit).

To use this service, it's necessary to have AWS configured locally. If you use
the AWS CLI, for example, then that'd be the case.

## Dataset synchronisation

Run `npm run ipset-update`.

It will push the serialised BST to Amazon S3. To customise the target, set
the following environment variables:

- `AUTH0_IPSET_BUCKET` (default: `auth0-firehol-ipset`).
- `AUTH0_IPSET_OBJECT_KEY` (default: `bst.json`).

The supported IP lists are available as constants in
[auth0-ipset-service.js](src/auth0-ipset-service.js).
