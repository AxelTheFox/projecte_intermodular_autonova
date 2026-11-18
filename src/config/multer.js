import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadPath = path.join(__dirname, "../../uploads/vehicles");
fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage ({ 
    destination: (req, file, cb) => { cb(null, uploadPath); },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLocaleLowerCase();
        const filename = `${Date.now()}-${randomUUID()}${extension}`;
        cb(null, filename);
    }
})

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Només s'accepten imatges en format .jpg, .png i .webp"));
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 5*1024*1024, files: 5 } });

export default upload;