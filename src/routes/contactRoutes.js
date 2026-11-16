import express from 'express';
import ContactMessage from '../models/ContactMessage.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { name, phone, email, message } = req.body
        if (!name || !email || !message) return res.status(400).json({ message: 'El nom, el correu i el missatge són obligatoris. '});
        
        const newMessage = new ContactMessage({ name, phone, email, message });
        await newMessage.save();
        res.status(201).json({ message: 'Missatge enviat correctament.', messageId: newMessage._id })
    } catch (error) {
        console.error('Error en guardar el missatge:', error);
        res.status(500).json ({ message: 'Error intern en enviar el missatge.'});
    }
});

export default router;