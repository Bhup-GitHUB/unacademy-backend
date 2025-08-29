import multer from "multer"
import path from "path"

const storage = multer.memoryStorage()

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (ext !== ".pdf" && ext !== ".jpg") {
      return cb(new Error("Only PDF and JPG files are allowed."))
    }
    cb(null, true)
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB file size limit
  }
})