import express from "express";
import mongoose from "mongoose";
import { requireAdmin } from "../middlewares/authMiddleware.js";
import SellRequest from "../models/SellRequest.js";
import Vehicle from "../models/Vehicle.js";

const router = express.Router();
router.use(requireAdmin);
router.get("/requests", async (req, res) => {
    try {
        const requests = await SellRequest.find().sort({ createdAt: -1 });
        return res.status(200).json(requests);
    } catch (error) {
        console.error("Error en obtindre les sol·licituds:", error);
        return res.status(500).json({ message: "Error en carregar les sol·licituds." });
    }
});

// Acceptar una sol·licitud i publicar el vehicle.
router.put("/requests/:id/accept", async (req, res) => {
    const session = await mongoose.startSession();

    try {
        let vehicleId;
        await session.withTransaction(async () => {
            const request = await SellRequest.findOne({ _id: req.params.id, status: "pending" }).session(session);
            if (!request) { const existingRequest = await SellRequest.findById(req.params.id).session(session);
                if (!existingRequest) {
                    const error = new Error("REQUEST_NOT_FOUND");
                    throw error;
                }
                const error = new Error("REQUEST_ALREADY_PROCESSED");
                throw error;
            }
            const newVehicle = new Vehicle({
                brand: request.vehicle.brand,
                model: request.vehicle.model,
                year: request.vehicle.year,
                engine: request.vehicle.engine,
                power: request.vehicle.power,
                kilometers: request.vehicle.kilometers,
                fuel: request.vehicle.fuel,
                transmission: request.vehicle.transmission,
                registration: request.vehicle.registration,
                price: request.vehicle.price,
                description: request.vehicle.description,
                images: request.images
            });
            await newVehicle.save({ session });
            request.status = "accepted";
            await request.save({ session });
            vehicleId = newVehicle._id;
        });

        return res.status(200).json({ message: "Sol·licitud acceptada. S'ha publicat el vehicle.", vehicleId });
    } catch (error) {
        console.error("Error en acceptar la sol·licitud:", error);
        if (error.message === "REQUEST_NOT_FOUND") return res.status(404).json({ message: "No s'ha trobat la sol·licitud." });
        if (error.message === "REQUEST_ALREADY_PROCESSED") return res.status(400).json({ message: "Aquesta sol·licitud ja ha sigut gestionada." });
        return res.status(500).json({ message: "Error al acceptar la sol·licitud." });
    } finally {
        await session.endSession();
    }
});

router.put("/requests/:id/reject", async (req, res) => {
    try {
        const request = await SellRequest.findOneAndUpdate(
            { _id: req.params.id, status: "pending" },
            { $set: { status: "rejected" } },
            { new: true, runValidators: true }
        );

        if (!request) {
            const existingRequest = await SellRequest.findById(req.params.id);
            if (!existingRequest) return res.status(404).json({ message: "No s'ha trobat la sol·licitud." });
            return res.status(400).json({ message: "Aquesta sol·licitud ja ha sigut gestionada." });
        }
        return res.status(200).json({ message: "Sol·licitud denegada correctament." });
    } catch (error) {
        console.error("Error en rebutjar la sol·licitud:", error);
        return res.status(500).json({ message: "Error al rebutjar la sol·licitud." });
    }
});

export default router;