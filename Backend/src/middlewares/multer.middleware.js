import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const tempDir = path.resolve("./public/temp");
      try { fs.mkdirSync(tempDir, { recursive: true }); } catch {}
      cb(null, tempDir)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
  })
  
export const upload = multer({ storage: storage })