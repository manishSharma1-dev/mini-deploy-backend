import { S3Client } from "@aws-sdk/client-s3";

const node_miniDeploy = new S3Client({
    region : "ap-south-1",
    credentials : {
        accessKeyId : process.env.AWS_ACCESS_KEY,
        secretAccessKey : process.env.AWS_SECERET_KEY
    }
})

export  {
    node_miniDeploy
}