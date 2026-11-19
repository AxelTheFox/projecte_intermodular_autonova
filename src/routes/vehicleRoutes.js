import express from "express";
import mongoose from "mongoose";
import Vehicle from "../models/Vehicle.js";

const router = express.Router();
router.get("/", async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ available: true }).sort({ createdAt: -1 }).lean();
        return res.status(200).json(vehicles);
    } catch (error) {
        console.error("Error en obtindre els vehicles:", error);
        return res.status(500).json({ message: "Error en carregar els vehicles." });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "L'identificador del vehicle no és vàlid." });
        const vehicle = await Vehicle.findOne({ _id: id, available: true }).lean();
        if (!vehicle) return res.status(404).json({ message: "No s'ha trobat el vehicle." });
        return res.status(200).json(vehicle);
    } catch (error) {
        console.error("Error en obtindre el vehicle:", error);
        return res.status(500).json({ message: "Error en carregar les dades del vehicle." });
    }
});

export default router;