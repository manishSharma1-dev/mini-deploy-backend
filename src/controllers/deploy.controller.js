import fs from 'fs';
import util from 'util'
import path from 'path'
import { ApiError } from  "../utils/ApiError.utils.js"
import { ApiResponse } from "../utils/Apiresponse.utils.js"

import { nodeS3_miniDeploy } from '../services/awsClient.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';



async function UploadFoldertoS3(folderPath,folderKey = ''){
    const BucketName = process.env.BUCKET_NAME
    
    const files = await util.promisify(fs.readdir)(folderPath);

    for( const fileName of files ){
        const fullPath = path.join(folderPath, fileName);
        const status = fs.lstatSync(fullPath);  // Check if it's a file or directory

        if(status.isDirectory()){
            UploadFoldertoS3(fullPath,`${folderKey}${fileName}/`)
        } else  {
             // If it's a file, read and upload it
            const fileContent = fs.readFileSync(fullPath);

            const s3Key = `${folderKey}${fileName}`;

            const command = new PutObjectCommand({
                Bucket : BucketName,
                Key  : s3Key,
                ContentType : handleContentType(fullPath),
                Body : fileContent
            })

            await nodeS3_miniDeploy.send(command)
            console.log("File Uploaded Successfully")

        }
    }
}

function handleContentType(filepath){
    const ext = path.extname(filepath).toLowerCase()
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
      };

      return mimeTypes[ext] || 'application/octet-stream';
}

const HandleUploadFoldertoS3  = async(req,res) => {
 try {
       const BuildFolderpath = path.join(__dirname,'../..' ,'Build_folder')
   
        await UploadFoldertoS3(BuildFolderpath)
        return res.status(200).json(
            new ApiResponse(
                200,
                "Upload -Successfull",
                {}
            )
        )

    } catch (error) {
        res.status(500).json(
            new ApiError(
                500,
                "Uploading -failed",
                error
            )
        )
    }
}


const hadleCreateCdnDistribution = async(req,res) => {
    try {
        const {key} =  req.body;
        const url = `${process.env.CDN_DISTRIBUTION_URL}/${key}`
    
        return res.status(200).json(
            ApiResponse(
                200,
                "CDN URL for the object",
                url
            )
        )
    } catch (error) {
        return res.status(500).json(
            new ApiError(
                500,
                "Failed to -Create CDN -url",
                error
            )
        )
    }
}

export { 
    HandleUploadFoldertoS3,
    hadleCreateCdnDistribution
}