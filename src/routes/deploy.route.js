import { Router } from "express";
import { HandleUploadFoldertoS3 } from "../controllers/deploy.controller.js"

const router = Router()

router.route('/api/deploy').post(HandleUploadFoldertoS3)

export { 
    router 
} 