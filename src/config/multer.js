import multer from "multer";
import path from "path";
import { fileTypeFromBuffer } from "file-type";

const storage = multer.memoryStorage();
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
            const detectedType = await fileTypeFromBuffer(file.buffer);
            const extension = path.extname(file.originalname).toLowerCase();
            const validType = detectedType && allowedExtensions[detectedType.mime]?.includes(extension) && detectedType.mime === file.mimetype;
            if (!validType) return res.status(400).json({ message: "Una de les imatges no té un format vàlid." });
        }
        next();
    } catch (error) {
        console.error("Error en verificar les imatges:", error);
        return res.status(400).json({ message: "No s'han pogut verificar les imatges." });
    }
};

export default upload;