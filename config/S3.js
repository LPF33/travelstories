const aws = require('aws-sdk');
const fs = require("fs");

let secrets = process.env;

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET
});

exports.getBucketURL = filename => {
    return `https://${secrets.AWS_BUCKET_NAME}.s3.eu-central-1.amazonaws.com/${filename}`;
};

exports.uploadToS3 = (fileFROMRequest) => {
    const {filename,mimetype, size, path} = fileFROMRequest;

    const s3UploadPromise = s3.putObject({
        Bucket: secrets.AWS_BUCKET_NAME,
        ACL: "public-read",
        Key: filename,
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size
    }).promise();

    return s3UploadPromise;
};

exports.deleteFromS3 = fileName => {
    const params = {
        Bucket: secrets.AWS_BUCKET_NAME, 
        Key: fileName
    };

    const s3DeletePromise = s3.deleteObject(params).promise();

    return s3DeletePromise;
};