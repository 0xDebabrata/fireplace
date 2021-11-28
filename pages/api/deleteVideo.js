import AWS from 'aws-sdk'

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_S3,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_S3,
})

const S3_BUCKET = "fireplace-videos";

const s3 = new AWS.S3()

export default function handler(req, res) {
    const body = JSON.parse(req.body)

    const params = { Bucket: S3_BUCKET, Key: body.key }

    s3.deleteObject(params, (err, data) => {
        if (err) {
            res.status(69).json({ err })
        } else {
            res.status(200).json({ success: "true" })
        }
    })
}


