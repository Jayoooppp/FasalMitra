/**
 * AWS S3 Storage Provider
 * 
 * Handles image upload, retrieval, and signed URL generation.
 * Used for disease diagnosis images, crop photos, user profile images, etc.
 * 
 * Requires:
 *   - AWS_S3_BUCKET
 *   - AWS_REGION
 */

const BUCKET = () => process.env.AWS_S3_BUCKET || 'fasalmitra-assets';

function getClient() {
    const { getS3Client } = require('../../config/aws');
    return getS3Client();
}

/**
 * Upload a file to S3
 * @param {Buffer|string} body - File content (Buffer for binary, string for base64)
 * @param {string} key - S3 object key (path in bucket), e.g., 'images/disease/photo1.jpg'
 * @param {string} contentType - MIME type, e.g., 'image/jpeg'
 * @param {boolean} isBase64 - If true, body is a base64 string that will be decoded
 * @returns {{ url: string, key: string }}
 */
async function upload(body, key, contentType = 'image/jpeg', isBase64 = false) {
    const { PutObjectCommand } = require('@aws-sdk/client-s3');
    const client = getClient();

    const fileBody = isBase64 ? Buffer.from(body, 'base64') : body;

    await client.send(new PutObjectCommand({
        Bucket: BUCKET(),
        Key: key,
        Body: fileBody,
        ContentType: contentType,
    }));

    const region = process.env.AWS_REGION || 'ap-south-1';
    const url = `https://${BUCKET()}.s3.${region}.amazonaws.com/${key}`;

    return { url, key };
}

/**
 * Generate a presigned URL for uploading (client-side upload)
 * @param {string} key - S3 object key
 * @param {string} contentType - MIME type
 * @param {number} expiresIn - URL expiration in seconds (default: 5 min)
 */
async function getPresignedUploadUrl(key, contentType = 'image/jpeg', expiresIn = 300) {
    const { PutObjectCommand } = require('@aws-sdk/client-s3');
    const { getSignedUrl: getSignedUrlFn } = require('@aws-sdk/s3-request-presigner');
    const client = getClient();

    const command = new PutObjectCommand({
        Bucket: BUCKET(),
        Key: key,
        ContentType: contentType,
    });

    const url = await getSignedUrlFn(client, command, { expiresIn });
    return url;
}

/**
 * Generate a presigned URL for reading/downloading
 * @param {string} key - S3 object key
 * @param {number} expiresIn - URL expiration in seconds (default: 1 hour)
 */
async function getSignedUrl(key, expiresIn = 3600) {
    const { GetObjectCommand } = require('@aws-sdk/client-s3');
    const { getSignedUrl: getSignedUrlFn } = require('@aws-sdk/s3-request-presigner');
    const client = getClient();

    const command = new GetObjectCommand({
        Bucket: BUCKET(),
        Key: key,
    });

    const url = await getSignedUrlFn(client, command, { expiresIn });
    return url;
}

/**
 * Delete an object from S3
 * @param {string} key - S3 object key
 */
async function deleteObject(key) {
    const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
    const client = getClient();

    await client.send(new DeleteObjectCommand({
        Bucket: BUCKET(),
        Key: key,
    }));
}

/**
 * List objects with a prefix
 * @param {string} prefix - S3 prefix, e.g., 'images/user123/'
 */
async function listObjects(prefix) {
    const { ListObjectsV2Command } = require('@aws-sdk/client-s3');
    const client = getClient();

    const result = await client.send(new ListObjectsV2Command({
        Bucket: BUCKET(),
        Prefix: prefix,
    }));

    return (result.Contents || []).map(item => ({
        key: item.Key,
        size: item.Size,
        lastModified: item.LastModified,
    }));
}

module.exports = {
    upload,
    getPresignedUploadUrl,
    getSignedUrl,
    deleteObject,
    listObjects,
};
