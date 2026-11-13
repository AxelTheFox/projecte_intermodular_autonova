
import express from 'express';
import SellRequest from '../models/SellRequest.js';

// Crear el router
const router = express.Router();

// Rebre una nova sol·licitud de venda
router.post('/', async (req, res) => {

    try {

        const { brand, model, year, engine, power, kilometers, fuel, transmission, registration, price, description,
            firstName, lastName, email, phone } = req.body;

        const requiredFields = [ brand, model, year, engine, power, kilometers, fuel, transmission, registration, price, description,
            firstName, lastName, email, phone ];

        if (requiredFields.some(value => value === undefined || value === null || value === '')) {
            return res.status(400).json({ message: 'Falten camps obligatoris.' });
        }

        const numericFields = { year: Number(year), power: Number(power), kilometers: Number(kilometers), price: Number(price) };

        if (Object.values(numericFields).some(value => !Number.isFinite(value))) {
            return res.status(400).json({ message: 'Les dades numèriques no són vàlides.' });
        }

        const newRequest = new SellRequest({
            vehicle: { brand, model, year: numericFields.year, engine, power: numericFields.power,
                kilometers: numericFields.kilometers, fuel, transmission, registration, price: numericFields.price, description },

            owner: { firstName, lastName, email, phone }
        });

        await newRequest.save();
        res.status(201).json({ message: 'Sol·licitud de venda enviada correctament.', requestId: newRequest._id });
    } catch (error) {
        console.error('Error en guardar la sol·licitud:', error);
        res.status(500).json({ message: 'Error intern en enviar la sol·licitud.' });
    }

});

export default router;
