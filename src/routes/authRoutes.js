import express from "express";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";

const router = express.Router();
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: true, legacyHeaders: false,
    message: { message: "Massa intents d'inici de sessió. Torna-ho a provar més tard." }
});

router.post("/login", loginLimiter, async (req, res) => {
    try {
        const { username, password } = req.body;

        if (typeof username !== "string" || typeof password !== "string" || !username || !password) {
            return res.status(400).json({ message: "Cal indicar l'usuari i la contrasenya." });
        }

        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminUsername || !adminPasswordHash) {
            return res.status(500).json({ message: "La configuració de l'administrador està incompleta." });
        }

        const validUsername = username === adminUsername;
        const validPassword = await bcrypt.compare(password, adminPasswordHash);

        if (!validUsername || !validPassword) {
            return res.status(401).json({ message: "Usuari o contrasenya incorrectes." });
        }

        req.session.regenerate((error) => {
            if (error) {
                console.error("Error en crear la sessió:", error);
                return res.status(500).json({ message: "No s'ha pogut iniciar la sessió." });
            }
            req.session.isAdmin = true;
            req.session.save((saveError) => {
                if (saveError) {
                    console.error("Error en guardar la sessió:", saveError);
                    return res.status(500).json({ message: "No s'ha pogut guardar la sessió." });
                }
                return res.status(200).json({ message: "Sessió iniciada correctament." });
            });
        });
    } catch (error) {
        console.error("Error en iniciar sessió:", error);
        res.status(500).json({ message: "Error intern en iniciar sessió." });
    }
});

router.post("/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) return res.status(500).json({ message: "No s'ha pogut tancar la sessió." });
        res.clearCookie("autonova.sid", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });
        res.status(200).json({ message: "Sessió tancada correctament."});
    });
});

router.get("/me", (req, res) => { res.status(200).json({ isAdmin: Boolean(req.session?.isAdmin) }); });
export default router;
