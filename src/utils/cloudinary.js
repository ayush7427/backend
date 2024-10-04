import { v2 as cloudinary } from "cloudinary"
// fs means file system  
// https://nodejs.org/api/fs.html#fspromisesunlinkpath
import fs from "fs"

// cloudinary.config({
//     cloud_name: 'dje66uhur',
//     api_key: '585169823475121',
//     api_secret: "V-oWiIj8ac367sjuE0Wce8F7Kh0"
// });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {

    try {
        if (!localFilePath) return null

        //  upload the file on cloudinary
        const res = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        // file has been successfully uploaded
        console.log("file is uploaded on cloudinary", res.url);
        return res

    } catch (error) {
        //  to delete or remove the locally saved temporary file as the upload operation got failed  
        fs.unlinkSync(localFilePath)
        return null
    }
}

export default uploadOnCloudinary