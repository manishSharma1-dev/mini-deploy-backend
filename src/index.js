import express from "express";
require('dotenv').config()

const app = express()

app.use(express.urlencoded({ extended : true }))
app.use(express.json())


const PORT = process.env.PORT ?? 4000
app.listen(PORT,() => console.log(`Server started at port ${PORT}`))