import fs from 'fs';
import { ApiError } from  "../utils/ApiError.utils"
import { ApiResponse } from "../utils/Apiresponse.utils"
import { node_miniDeploy } from '../services/awsClient';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import util from 'util'
import path from 'path'

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

            await node_miniDeploy.send(command)
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

export { 
    HandleUploadFoldertoS3
}