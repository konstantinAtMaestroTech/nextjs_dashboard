const { SdkManagerBuilder } = require('@aps_sdk/autodesk-sdkmanager');
const { AuthenticationClient, Scopes } = require('@aps_sdk/authentication');
const { OssClient, CreateBucketsPayloadPolicyKeyEnum, CreateBucketXAdsRegionEnum } = require('@aps_sdk/oss');
const { ModelDerivativeClient } = require('@aps_sdk/model-derivative');

const sdk = SdkManagerBuilder.create().build();
const authenticationClient = new AuthenticationClient(sdk);
const ossClient = new OssClient(sdk);
const modelDerivativeClient = new ModelDerivativeClient(sdk);

const APS_CLIENT_ID = process.env.aps_client_id;
const APS_CLIENT_SECRET = process.env.aps_client_secret;
const APS_BUCKET = process.env.aps_bucket || `${APS_CLIENT_ID.toLowerCase()}-basic-app`;

export async function getInternalToken() {
    const credentials = await authenticationClient.getTwoLeggedToken(APS_CLIENT_ID, APS_CLIENT_SECRET, [
        Scopes.DataRead,
        Scopes.DataCreate,
        Scopes.DataWrite,
        Scopes.BucketCreate,
        Scopes.BucketRead
    ]);
    return credentials;
};

export async function getPublicToken() {
    const credentials = await authenticationClient.getTwoLeggedToken(APS_CLIENT_ID, APS_CLIENT_SECRET, [
        Scopes.DataRead
    ]);
    return credentials;
};

export async function ensureBucketExists(bucketKey) {
    const { access_token } = await getInternalToken();
    try {
        await ossClient.getBucketDetails(access_token, bucketKey);
    } catch (err) {
        if (err.axiosError.response.status === 404) {
            await ossClient.createBucket(access_token, CreateBucketXAdsRegionEnum.Us, {
                bucketKey: bucketKey,
                policyKey: CreateBucketsPayloadPolicyKeyEnum.Persistent
            });
        } else {
            throw err;  
        }
    }
};

export async function listObjects() {
    await ensureBucketExists(APS_BUCKET);
    const { access_token } = await getInternalToken();
    let resp = await ossClient.getObjects(access_token, APS_BUCKET, { limit: 64 });
    let objects = resp.items;
    while (resp.next) {
        const startAt = new URL(resp.next).searchParams.get('startAt');
        resp = await ossClient.getObjects(access_token, APS_BUCKET, { limit: 64, startAt });
        objects = objects.concat(resp.items);
    }
    return objects;
};

export async function getManifest(urn) {
    const { access_token } = await getInternalToken();
    try {
        const manifest = await modelDerivativeClient.getManifest(access_token, urn);
        return manifest;
    } catch (err) {
        if (err.axiosError.response.status === 404) {
            return null;
        } else {
            throw err;
        }
    }
};

export function urnify(id) {Buffer.from(id).toString('base64').replace(/=/g, '')};