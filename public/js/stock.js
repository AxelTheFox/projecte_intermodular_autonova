const vehicleGrid = document.getElementById('vehicle-grid');
const vehicleCount = document.getElementById('vehicle-count');

async function loadVehicles() {
    try {
        const response = await fetch('/api/vehicles');

        if (!response.ok) throw new Error('Error en carregar els vehicles');
        const vehicles = await response.json();
        vehicleCount.textContent = `${vehicles.length} vehicles trobats`;

        if (vehicles.length === 0) {
            vehicleGrid.innerHTML = `
            <p class="empty-stock">Actualment no hi ha vehicles disponibles.</p>`;
            return;
        }

        vehicleGrid.innerHTML = vehicles.map(vehicle => `
            <article class="vehicle-card">
                <div class="vehicle-card-image">
                    <img src="${vehicle.images?.[0] || 'assets/images/hero-car.jpg'}" alt="${vehicle.brand} ${vehicle.model}">
                </div>
                <div class="vehicle-card-content">
                    <h3>${vehicle.brand} ${vehicle.model}</h3>
                    <p>${vehicle.year} · ${vehicle.kilometers.toLocaleString('ca-ES')} km</p>
                    <p>${vehicle.fuel} · ${vehicle.transmission}</p>
                    <p class="vehicle-card-price">${vehicle.price.toLocaleString('ca-ES')} €</p>
                    <a href="vehicle.html?id=${vehicle._id}" class="btn-primary">Veure vehicle</a>
                </div>
            </article>
        `).join('');

    } catch (error) {
        console.error('Error:', error);
        vehicleGrid.innerHTML = `<p class="empty-stock">No s'han pogut carregar els vehicles. Torna-ho a intentar.</p>`;
    }
}

loadVehicles();