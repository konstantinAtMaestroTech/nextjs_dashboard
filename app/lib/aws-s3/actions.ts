"use server"

import {auth} from "@/auth";
import {S3Client, PutObjectCommand, GetObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
    region: process.env.AWS_BUCKET_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
})

export async function s3_getSignedURL_dbid(dbid: number) {

    const session = await auth();

    if (!session) {
        return {failure: "Not authenticated"}
    }

    const putObjCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: `${dbid}.obj`,
    })

    const signedURL = await getSignedUrl(s3, putObjCommand, {
        expiresIn: 60,
    })

    return {success: {url: signedURL}}
}

export async function s3_getSignedURL_qr(clientViewId: string, supersetId: string) {

    const session = await auth();

    if (!session) {
        return {failure: "Not authenticated"}
    }

    const putObjCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: `${clientViewId}/qr-zones/${supersetId}.pdf`,
    })

    const signedURL = await getSignedUrl(s3, putObjCommand, {
        expiresIn: 60,
    })

    return {success: {url: signedURL}}
}

export async function s3_get_by_dbid(dbid: number) {

    const session = await auth();

    if (!session) {
        return {failure: "Not authenticated"}
    }

    const getObjCmnd = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: `${dbid}.obj`
    })

    const res = await s3.send(getObjCmnd);

    const data = res.Body?.transformToByteArray()

    return data
}

export async function s3_get_public_asset(asset: string) {

    const session = await auth();

    if (!session) {
        return {failure: "Not authenticated"}
    }

    const getObjCmnd = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: `public/${asset}`
    })

    const res = await s3.send(getObjCmnd);

    const data = res.Body?.transformToByteArray()

    return data
}

export async function s3_get_label(clientViewId: string, supersetId: string) {

    const session = await auth();

    if (!session) {
        return {failure: "Not authenticated"}
    }

    console.log('The specified key is ', `${clientViewId}/qr-zones/${supersetId}.pdf`);

    const getObjCmnd = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: `${clientViewId}/qr-zones/${supersetId}.pdf`
    })

    const res = await s3.send(getObjCmnd);

    const data = res.Body?.transformToByteArray()

    return data
}