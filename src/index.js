import express from "express";
import { router } from "./routes/deploy.route.js"
require('dotenv').config()

const app = express()

app.use(express.urlencoded({ extended : true }))
app.use(express.json())

app.use('/', router)


const PORT = process.env.PORT ?? 4000
app.listen(PORT,() => console.log(`Server started at port ${PORT}`))