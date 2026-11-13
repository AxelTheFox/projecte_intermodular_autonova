import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Servidor funcionant correctament' });
});

app.listen(PORT, () => {
    console.log(`Servidor disponible en http://localhost:${PORT}`);
});