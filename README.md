# AUTONOVA

**Plataforma web de compravenda de vehicles d'ocasió**

## Descripció

AUTONOVA és una aplicació web desenvolupada com a projecte acadèmic que simula el funcionament d'un concessionari de vehicles d'ocasió.

Permet consultar vehicles disponibles, aplicar filtres de cerca, enviar sol·licituds de venda i contactar amb el concessionari. També incorpora un panell d'administració per gestionar les sol·licituds rebudes.

## Funcionalitats principals

- Pàgina d'inici amb carrusel de vehicles.
- Catàleg amb cerca i filtres.
- Fitxes de vehicles amb fotografies i especificacions.
- Formulari de sol·licitud de venda amb pujada de fotografies.
- Formulari de contacte.
- Panell d'administració amb autenticació.
- Gestió de sol·licituds i incorporació de vehicles acceptats a l'estoc.

## Tecnologies utilitzades

- **Frontend:** HTML5, CSS3 i JavaScript.
- **Backend:** Node.js i Express.js.
- **Base de dades:** MongoDB i Mongoose.
- **Autenticació i seguretat:** Express Session, Connect-Mongo i bcryptjs.
- **Imatges:** Multer i Cloudinary.
- **Desplegament:** Render.
- **Control de versions:** Git i GitHub.

## Requisits previs

- Node.js i npm.
- Compte de MongoDB Atlas.
- Compte de Cloudinary.
- Git (opcional).

## Instal·lació

1. Clonar el repositori:

```bash
git clone https://github.com/AxelTheFox/projecte_intermodular_autonova.git
```

2. Entrar en la carpeta i instal·lar les dependències:

```bash
cd projecte_intermodular_autonova
npm install
```

3. Crear el fitxer `.env` a partir de `.env.example` i configurar les variables necessàries:

- `PORT`
- `MONGO_URI`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD_HASH`
- `SESSION_SECRET`
- `NODE_ENV`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

4. Iniciar el servidor:

```bash
npm run dev
```

5. Obrir l'aplicació en el navegador:

```text
http://localhost:3000
```

Panell d'administració:

```text
http://localhost:3000/admin.html
```

**Important:** El fitxer `.env` conté informació privada i no s'ha de pujar al repositori.

## Estructura del projecte

```text
projecte_intermodular_autonova/
├── public/          # Pàgines, estils, scripts i imatges
├── src/
│   ├── config/      # Configuració de serveis
│   ├── middlewares/ # Control d'accés
│   ├── models/      # Models de MongoDB
│   ├── routes/      # Rutes de l'API
│   └── server.js    # Servidor principal
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Desplegament

L'aplicació està desplegada amb Render, utilitza MongoDB Atlas com a base de dades i Cloudinary per a l'emmagatzematge de fotografies.
Web pública de AUTONOVA: https://autonova-tcoz.onrender.com/

---

## Avís

AUTONOVA és un projecte acadèmic independent, desenvolupat amb finalitats educatives i demostratives. No representa una empresa real ni té cap vinculació oficial amb altres empreses o marques que puguen utilitzar denominacions semblants.