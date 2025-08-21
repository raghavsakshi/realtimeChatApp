import multer from "multer"
import path from "path"
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, "./public")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
})
export const upload = multer({ storage })
