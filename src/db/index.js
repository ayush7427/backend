import mongoose from "mongoose"
import dotenv from "dotenv"
import { DB_NAME } from "../constants.js"

dotenv.config()

const connectDB = async () => {

    try {

        const res = await mongoose.connect(`${process.env.MONOGODB_URL}/${DB_NAME}`)
        console.log("Db connected:", res.connection.host);
    } catch (error) {
        console.log("DB connection error:", error);
        throw error
    }

}

export default connectDB