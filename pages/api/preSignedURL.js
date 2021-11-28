import AWS from 'aws-sdk'

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_S3,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_S3,
})

const S3_BUCKET = "fireplace-videos";
const REGION = "us-east-1";
const URL_EXPIRATION_TIME = 60; // in seconds

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET},
    region: REGION,
})

export default async function handler(req, res) {

    const body = JSON.parse(req.body)

    myBucket.getSignedUrl('putObject', {
        Key: `${body.userId}/${body.fileName}`,
        ContentType: body.fileType,
        Expires: URL_EXPIRATION_TIME
    } , (err , url) => {
        if (!err) {
            res.status(200).json({ url: url })
        } else {
            res.status(69).json({ err })
        }
    });

}
