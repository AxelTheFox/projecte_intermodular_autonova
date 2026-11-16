import express from 'express';
import Vehicle from '../models/Vehicle.js';

const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ available: true }).sort({ createdAt: -1});
        res.status(200).json(vehicles);
    } catch (error) {
        console.error("Error en obtindre els vehicles:", error);
        res.status(500).json({ message: "Error en carregar els vehicles." });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const vehicle = await Vehicle.findOne({ _id: req.params.id, available: true });
        if (!vehicle) return res.status(404).json({ message: "No s'ha trobat el vehicle" });
        res.status(200).json(vehicle);
    } catch (error) {
        console.error("Error el obtindre el vehicle:", error);
        res.status(500).json({ message: "Error en carregar les dades del vehicle" });
    }
});

export default router;