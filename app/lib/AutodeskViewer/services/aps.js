const { SdkManagerBuilder } = require('@aps_sdk/autodesk-sdkmanager');
const { AuthenticationClient, Scopes } = require('@aps_sdk/authentication');
const { OssClient, CreateBucketsPayloadPolicyKeyEnum, CreateBucketXAdsRegionEnum } = require('@aps_sdk/oss');
const {ModelDerivativeClient, View, OutputType} = require('@aps_sdk/model-derivative');

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

export async function uploadObject(objectName, filePath) {
    await ensureBucketExists(APS_BUCKET);
    const {access_token} = await getInternalToken();
    const obj = await ossClient.upload(APS_BUCKET, objectName, filePath, access_token);
    return obj;
}

export async function translateObject(urn, rootFilename) {
    const { access_token } = await getInternalToken();
    console.log('we are inside the tranlation job')
    const job = await modelDerivativeClient.startJob(access_token, {
        input: {
            urn,
            compressedUrn: !!rootFilename,
            rootFilename
        },
        output: {
            formats: [{
                views: [View._2d, View._3d],
                type: OutputType.Svf
            }]
        }
    });
    console.log('translation job is done', job.result)
    return job.result;
}

export async function deleteFile(filename) {

    // deletes the bucket from the OSS. Does not delete the manifest and derivatives

    const {access_token} = await getInternalToken();
    console.log('encodeURIComponent filename', encodeURIComponent(filename));
    console.log('encodeURI filename', encodeURI(filename));
    
    try {
        let resp = await ossClient.deleteObject(access_token, APS_BUCKET, filename);
        console.log('deleteFile resp is', resp);
        return resp;

    } catch (err) {
        console.log('delete file error' + resp)
    }
}

export async function deleteManifest(urn) {

    const {access_token} = await getInternalToken();

    try {
        // urn is already URL-safe base64 encoded
        let resp = await modelDerivativeClient.deleteManifest(access_token, urn);
        console.log('deleteManifest resp is', resp);
    } catch (error) {
        console.log('deleteManifest resp is', resp);
    }
}

export async function getManifest(urn) {
    const { access_token } = await getInternalToken();
    try {
        console.log('Here is the urn from getManifest', urn)
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

export function urnify(id) {return Buffer.from(id).toString('base64').replace(/=/g, '')};