import { v2 as cloudinary } from "cloudinary"
// fs means file system  
// https://nodejs.org/api/fs.html#fspromisesunlinkpath
import fs from "fs"



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {

    try {

        if (!localFilePath || undefined) return null

        //  upload the file on cloudinary
        const res = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        // file has been successfully uploaded
        console.log("file is uploaded on cloudinary: ", res.url);
        fs.unlinkSync(localFilePath)
        // console.log("res: ", res);

        return res

    } catch (error) {
        console.log("Cloudinary error: ", error);

        //  to delete or remove the locally saved temporary file as the upload operation got failed  
        fs.unlinkSync(localFilePath)
        return null
    }
}

export default uploadOnCloudinary