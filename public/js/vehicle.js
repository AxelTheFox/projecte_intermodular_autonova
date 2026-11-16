const vehicleGallery = document.getElementById('vehicle-gallery');
const vehicleDescription = document.getElementById('vehicle-description');

const urlParams = new URLSearchParams(window.location.search);
const vehicleId = urlParams.get('id');

function checkVehicleId() {
    if (!vehicleId) {
        vehicleDescription.innerHTML = `
        <p>No s'ha especificat cap vehicle.</p>
        <a href="stock.html">Tornar al catàleg</a>`;

        return false;
    }

    return true;
}

async function loadVehicle() {
    if (!checkVehicleId()) return;

    try {
        const response = await fetch(`/api/vehicles/${vehicleId}`);

        if (!response.ok) {
            if (response.status === 404) throw new Error('No s\'ha trobat aquest vehicle.');
            throw new Error('Error en carregar el vehicle.');
        }

        const vehicle = await response.json();

        if (vehicle.images && vehicle.images.length > 0) {
            vehicleGallery.innerHTML = vehicle.images.map(image => `
                <img src="${image}" alt="${vehicle.brand} ${vehicle.model}">
            `).join('');
        } else {
            vehicleGallery.innerHTML = `<p>Aquest vehicle encara no té fotografies.</p>`;
        }

        vehicleDescription.innerHTML = `
            <h1>${vehicle.brand} ${vehicle.model}</h1>
            <p class="vehicle-detail-price">${vehicle.price.toLocaleString('ca-ES')} €</p>
            <div class="vehicle-specifications">
                <p><strong>Any:</strong> ${vehicle.year}</p>
                <p><strong>Motor:</strong> ${vehicle.engine}</p>
                <p><strong>Potència:</strong> ${vehicle.power} CV</p>
                <p><strong>Quilòmetres:</strong> ${vehicle.kilometers.toLocaleString('ca-ES')} km</p>
                <p><strong>Combustible:</strong> ${vehicle.fuel}</p>
                <p><strong>Canvi:</strong> ${vehicle.transmission}</p>
            </div>
            <div class="vehicle-detail-description">
                <h2>Descripció</h2>
                <p>${vehicle.description}</p>
            </div>
            <a href="contact.html" class="btn-primary">Contactar amb nosaltres</a>`;
    } catch (error) {
        console.error('Error en carregar el vehicle:', error);
        vehicleGallery.innerHTML = '';
        vehicleDescription.innerHTML = `<p>${error.message}</p><a href="stock.html">Tornar al catàleg</a>`;
    }
}

loadVehicle();