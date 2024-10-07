import { S3Client } from "@aws-sdk/client-s3";
import { CloudFrontClient } from "@aws-sdk/client-cloudfront"

const nodeS3_miniDeploy = new S3Client({
    region : "ap-south-1",
    credentials : {
        accessKeyId : process.env.AWS_ACCESS_KEY,
        secretAccessKey : process.env.AWS_SECERET_KEY
    }
})

const minideploy_cdnClient = new CloudFrontClient({
    region : "ap-south-1",
    credentials : {
        accessKeyId : process.env.AWS_ACCESS_KEY,
        secretAccessKey : process.env.AWS_SECERET_KEY
    }
})

export  {
    nodeS3_miniDeploy,
    minideploy_cdnClient
}