import express from "express";
import SellRequest from "../models/SellRequest.js";
import upload, { validateUploadedImages } from "../config/multer.js";

const router = express.Router();

router.post('/', upload.array("images", 5), validateUploadedImages, async (req, res) => {

    try {

        const { brand, model, year, engine, power, kilometers, fuel, transmission, registration, price, description,
            firstName, lastName, email, phone } = req.body;

        const requiredFields = [ brand, model, year, engine, power, kilometers, fuel, transmission, registration, price, description,
            firstName, lastName, email, phone ];

        if (requiredFields.some(value => value === undefined || value === null || value === "")) {
            return res.status(400).json({ message: "Falten camps obligatoris." });
        }

        const numericFields = { year: Number(year), power: Number(power), kilometers: Number(kilometers), price: Number(price) };

        if (Object.values(numericFields).some(value => !Number.isFinite(value))) {
            return res.status(400).json({ message: "Les dades numèriques no són vàlides." });
        }

        const images = (req.files || []).map(file => `/uploads/vehicles/${file.filename}`); 

        const newRequest = new SellRequest({
            vehicle: { brand, model, year: numericFields.year, engine, power: numericFields.power,
                kilometers: numericFields.kilometers, fuel, transmission, registration, price: numericFields.price, description },

            owner: { firstName, lastName, email, phone },

            images
        });

        await newRequest.save();
        res.status(201).json({ message: "Sol·licitud de venda enviada correctament.", requestId: newRequest._id });
    } catch (error) {
        console.error("Error al guardar la sol·licitud:", error);
        res.status(500).json({ message: "Error intern al enviar la sol·licitud." });
    }

});

router.use((error, req, res, next) => {
    if (error instanceof Error && error.name === "MulterError") {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ message: "Les imatges no poden passar de 5 MB." });
        }
        if (error.code === "LIMIT_FILE_COUNT") {
            return res.status(400).json({ message: "Només es poden muntar 5 imatges com a màxim" });
        }
        return res.status(400).json({ message: "Error al pujar les imatges." });
    }

    if (error.message?.includes("Només s'accepten imatges")) return res.status(400).json({ message: error.message });
    next(error);
});

export default router;
