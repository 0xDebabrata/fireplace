import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand, S3ClientConfig } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3_BUCKET = "fireplace-videos";
const REGION = "us-east-1";
const URL_EXPIRATION_TIME = 18000; // in seconds (5 hrs)

const s3Config: S3ClientConfig = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_S3 || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_S3 || "",
  },
  region: REGION,
};
const s3 = new S3Client(s3Config);

export async function POST(req: Request, _res: Response) {
  const {
    fileName,
    videoId,
    userId,
  } = await req.json();
  const key = `${userId}/${videoId}/${fileName}`;
  console.log(key)

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
  });
  const url = await getSignedUrl(s3, command, {
    expiresIn: URL_EXPIRATION_TIME,
  });
  return NextResponse.json({ url });
}
