import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.NEXT_PUBLIC_CLOUD_FLARE_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_CLOUD_FLARE_SECRET_ACCESS_KEY,
  endpoint: process.env.NEXT_PUBLIC_CLOUD_FLARE_ENDPOINT,
  region: process.env.NEXT_PUBLIC_CLOUD_FLARE_REGION,
  signatureVersion: 'v4',
});

export const uploadFile = async (fileContent, fileName, mimeType) => {

  const params = {
    Bucket: process.env.NEXT_PUBLIC_CLOUD_FLARE_BUCKET_NAME,
    Key: fileName,
    Body: fileContent,
    ContentType: mimeType,
  };

  return await s3.upload(params).promise();
};

export const getFileUrl = (fileName) => {
  const endpoint ="https://pub-5f21350fbb5e4f11aa7546453ecea699.r2.dev"; // e.g., https://<bucket-name>.<account-id>.r2.cloudflarestorage.com
  const bucket = process.env.NEXT_PUBLIC_CLOUD_FLARE_BUCKET_NAME;

  // Construct the public URL
  return `${endpoint}/${bucket}/${fileName}`;
};
