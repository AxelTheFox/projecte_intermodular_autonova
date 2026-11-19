import { requireAdmin } from '../middlewares/authMiddleware.js';
import express from 'express';
import SellRequest from '../models/SellRequest.js';
import Vehicle from '../models/Vehicle.js';

const router = express.Router();
router.use(requireAdmin);

router.get('/requests', async (req, res) => {
    try {
        const requests = await SellRequest.find().sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (error) {
        console.error("Error en obtindre les sol·licituds:", error);
        res.status(500).json({ message: "Error en carregar les sol·licituds." })
    }
});

router.put('/requests/:id/accept', async (req, res) => {
    try {
        const request = await SellRequest.findById(req.params.id);
        if (!request) return res.status(404).json ({ message: "No s'ha trobat la sol·licitud." });
        if (request.status !== 'pending') return res.status(400).json ({ message: "Aquesta sol·licitud ja ha sigut gestionada." });

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

        await newVehicle.save();
        request.status = 'accepted';
        await request.save();
        res.status(200).json({ message: "SOL·LICITUD ACCEPTADA. S'ha publicat el vehicle.", vehicleId: newVehicle._id });
    } catch (error) {
        res.status(500).json({ message: "Error al acceptar la sol·licitud", error });
    }
});

router.put('/requests/:id/reject', async (req, res) => {
    try {
        const request = await SellRequest.findById(req.params.id);
        if (!request) return res.status(404).json ({ message: "No s'ha trobat la sol·licitud." });
        if (request.status !== 'pending') return res.status(400).json ({ message: "Aquesta sol·licitud ja ha sigut gestionada." });
        request.status = 'rejected';
        await request.save();
        res.status(200).json({ message: "Sol·licitud denegada correctament." })
    } catch (error) {
        res.status(500).json({ message: "Error al rebutjar la sol·licitud"})
    }
});

export default router;