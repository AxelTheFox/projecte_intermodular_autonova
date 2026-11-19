import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import connectDB from "./config/database.js";
import sellRoutes from "./routes/sellRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.SESSION_SECRET) throw new Error("SESSION_SECRET no està configurat en el fitxer .env");
if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);

app.use(session({
    name: "autonova.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: "sessions",
        ttl: 8 * 60 * 60
    }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 8 * 60 * 60 * 1000
    }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/sell", sellRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes); 

connectDB().then(() => {
    const publicPath = path.join(__dirname, "../public");
    const uploadsPath = path.join(__dirname, "../uploads"); 
    app.use(express.static(publicPath));
    app.use("/uploads", express.static(uploadsPath));
    app.get("/api/health", (req, res) => { res.json({ status: "ok", message: "Servidor funcionant correctament" }) });
    app.listen(PORT, () => { console.log(`Servidor disponible en http://localhost:${PORT}`)});
});
