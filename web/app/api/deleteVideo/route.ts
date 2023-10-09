import { S3Client, DeleteObjectCommand, S3ClientConfig } from '@aws-sdk/client-s3'
import { NextResponse } from 'next/server';

const S3_BUCKET = "fireplace-videos";
const REGION = "us-east-1";

const s3Config: S3ClientConfig = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_S3 || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_S3 || '',
  },
  region: REGION,
}
const s3 = new S3Client(s3Config)

export async function POST(req: Request, res) {
  const body = await req.json()
  const params = { 
    Bucket: S3_BUCKET,
    Key: body.key 
  }
  const command = new DeleteObjectCommand(params)
  await s3.send(command)
  return NextResponse.json({ success: "true" })
}
