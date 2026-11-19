import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";
import fs from "fs";
import { unlink } from "fs/promises";
import { fileTypeFromFile } from "file-type";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadPath = path.join(__dirname, "../../uploads/vehicles");
fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const filename = `${Date.now()}-${randomUUID()}${extension}`;
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Només s'accepten imatges en format .jpg, .png i .webp"));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024, files: 5 } });

export const validateUploadedImages = async (req, res, next) => {
    const files = req.files || [];
    try {
        const allowedExtensions = { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"] };
        for (const file of files) {
            const detectedType = await fileTypeFromFile(file.path);
            const validType = detectedType && allowedExtensions[detectedType.mime]?.includes(path.extname(file.originalname).toLowerCase());
            if (!validType) {
                await Promise.allSettled(files.map(file => unlink(file.path)));
                return res.status(400).json({ message: "Una de les imatges no té un format vàlid." });
            }
        }
        next();
    } catch (error) {
        await Promise.allSettled(files.map(file => unlink(file.path)));
        console.error("Error en verificar les imatges:", error);
        return res.status(400).json({ message: "No s'han pogut verificar les imatges." });
    }
};

export default upload;