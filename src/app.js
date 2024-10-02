import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

//  for data handling 
app.use(express.json({
    limit: "16kb"
}))
//  for data file handling
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))
// for pdf images handling
app.use(express.static("public"))

app.use(cookieParser())
export { app }