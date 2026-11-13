import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB().then(() => {
    const publicPath = path.join(__dirname, '../public');
    app.use(express.static(publicPath));
    
        app.get('/api/health', (req, res) => {
        res.json({ status: 'ok', message: 'Servidor funcionant correctament' });
    });

    app.listen(PORT, () => {
        console.log(`Servidor disponible en http://localhost:${PORT}`);
    });
});
