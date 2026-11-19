import express from "express";
import ContactMessage from "../models/ContactMessage.js";
const router = express.Router();
router.post("/", async (req, res) => {
    try {
        const { name, phone, email, message } = req.body;

        if (
            typeof name !== "string" || typeof email !== "string" || typeof message !== "string" ||
            !name.trim() || !email.trim() || !message.trim()
        ) {
            return res.status(400).json({ message: "El nom, el correu i el missatge són obligatoris." });
        }

        if (phone !== undefined && phone !== null && typeof phone !== "string") {
            return res.status(400).json({ message: "El telèfon indicat no és vàlid." });
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanPhone = typeof phone === "string"
            ? phone.trim()
            : "";
        const cleanMessage = message.trim();

        if ( cleanName.length > 100 || cleanEmail.length > 254 || cleanPhone.length > 20 || cleanMessage.length > 2000) {
            return res.status(400).json({ message: "Alguns camps superen la longitud màxima permesa." });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
            return res.status(400).json({ message: "El correu electrònic no té un format vàlid." });
        }

        const newMessage = new ContactMessage({ name: cleanName, phone: cleanPhone || undefined, email: cleanEmail, message: cleanMessage });
        await newMessage.save();
        return res.status(201).json({ message: "Missatge enviat correctament.", messageId: newMessage._id });
    } catch (error) {
        console.error("Error al guardar el missatge:", error);
        return res.status(500).json({ message: "Error intern en enviar el missatge." });
    }
});

export default router;