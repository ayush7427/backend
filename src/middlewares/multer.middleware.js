import multer from "multer";

// https://github.com/expressjs/multer

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
        console.log("file upload on Multer: ", file);

        cb(null, file.originalname)
    }
})

export const upload = multer({ storage: storage })