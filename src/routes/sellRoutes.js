import express from "express";
import { unlink } from "fs/promises";
import SellRequest from "../models/SellRequest.js";
import upload, { validateUploadedImages } from "../config/multer.js";

const router = express.Router();
const removeUploadedFiles = async (files = []) => {
    await Promise.allSettled(
        files.map(file => unlink(file.path))
    );
};

router.post("/", upload.array("images", 5), validateUploadedImages, async (req, res) => {
        try {
            const { brand, model, year, engine, power, kilometers, fuel, transmission, registration, price, description,
                firstName, lastName, email, phone } = req.body;

            const requiredFields = [brand, model, year, kilometers, fuel, transmission, price, firstName, lastName,
                email, phone];

            if (requiredFields.some(value => value === undefined || value === null || String(value).trim() === "")) {
                await removeUploadedFiles(req.files);
                return res.status(400).json({ message: "Falten camps obligatoris." });
            }

            const numericFields = { year: Number(year), kilometers: Number(kilometers), price: Number(price) };
            if (Object.values(numericFields).some(value => !Number.isFinite(value))) {
                await removeUploadedFiles(req.files);
                return res.status(400).json({ message: "Les dades numèriques no són vàlides." });
            }

            if (numericFields.year < 1980 || numericFields.year > 2099 || numericFields.kilometers < 0 ||
                numericFields.kilometers > 2000000 || numericFields.price < 1 || numericFields.price > 100000000) {
                await removeUploadedFiles(req.files);
                return res.status(400).json({ message: "Alguns valors numèrics estan fora dels límits permesos." });
            }
            let numericPower;
            if (power !== undefined && power.trim() !== "") {
                numericPower = Number(power);
                if (!Number.isFinite(numericPower) || numericPower < 1 || numericPower > 2000) {
                    await removeUploadedFiles(req.files);
                    return res.status(400).json({ message: "La potència indicada no és vàlida." });
                }
            }
            const cleanEmail = email.trim().toLowerCase();
            const cleanPhone = phone.trim();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || cleanPhone.length < 6 || cleanPhone.length > 20) {
                await removeUploadedFiles(req.files);
                return res.status(400).json({ message: "El correu electrònic o el telèfon no són vàlids." });
            }
            const allowedFuel = ["Gasolina", "Dièsel", "Híbrid", "Elèctric", "GLP", "Altres"];
            const allowedTransmission = ["Manual", "Automàtic"];
            if (!allowedFuel.includes(fuel) || !allowedTransmission.includes(transmission)) {
                await removeUploadedFiles(req.files);
                return res.status(400).json({ message: "El combustible o la transmissió no són vàlids." });
            }
            const images = (req.files || []).map(file => `/uploads/vehicles/${file.filename}`);
            const newRequest = new SellRequest({
                vehicle: {
                    brand: brand.trim(),
                    model: model.trim(),
                    year: numericFields.year,
                    engine: engine?.trim() || undefined,
                    power: numericPower,
                    kilometers: numericFields.kilometers,
                    fuel,
                    transmission,
                    registration: registration?.trim() || undefined,
                    price: numericFields.price,
                    description: description?.trim() || undefined
                },
                owner: {
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    email: cleanEmail,
                    phone: cleanPhone
                },
                images
            });

            await newRequest.save();
            return res.status(201).json({ message: "Sol·licitud de venda enviada correctament.", requestId: newRequest._id });
        } catch (error) {
            await removeUploadedFiles(req.files);
            console.error("Error al guardar la sol·licitud:", error);
            return res.status(500).json({ message: "Error intern al enviar la sol·licitud." });
        }
    }
);

router.use((error, req, res, next) => {
    if (error instanceof Error && error.name === "MulterError") {
        if (error.code === "LIMIT_FILE_SIZE") return res.status(400).json({ message: "Les imatges no poden passar de 5 MB." });
        if (error.code === "LIMIT_FILE_COUNT") return res.status(400).json({ message: "Només es poden pujar 5 imatges com a màxim." });
        return res.status(400).json({ message: "Error al pujar les imatges." });
    }
    if (error.message?.includes("Només s'accepten imatges")) return res.status(400).json({ message: error.message });
    next(error);
});

export default router;
