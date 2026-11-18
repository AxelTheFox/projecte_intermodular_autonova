
const vehicleGrid = document.getElementById("vehicle-grid");
const vehicleCount = document.getElementById("vehicle-count");
const filtersForm = document.querySelector(".filters-form");

let allVehicles = [];
function normalize(value) { return String(value ?? "").trim().toLowerCase(); }

function getInitialFilters() {
    const params = new URLSearchParams(window.location.search);
    const filters = {
        brand: params.get("brand") || "",
        minYear: params.get("minYear") || "",
        maxYear: params.get("maxYear") || "",
        minPrice: params.get("minPrice") || "",
        maxPrice: params.get("maxPrice") || "",
        maxKm: params.get("maxKm") || "",
        fuel: params.get("fuel") || "",
        transmission: params.get("transmission") || ""
    };

    const homeYear = params.get("year");
    if (homeYear) filters.minYear = homeYear; filters.maxYear = homeYear;
    return filters;
}

function fillFilters(filters) {
    Object.entries(filters).forEach(([name, value]) => {
        const field = filtersForm.elements.namedItem(name);
        if (field) field.value = value;
    });
}

// Comprovem si un vehicle compleix els filtres
function filterVehicles() {
    const filters = new FormData(filtersForm);

    const brand = normalize(filters.get("brand"));
    const minYear = Number(filters.get("minYear")) || 0;
    const maxYear = Number(filters.get("maxYear")) || Infinity;
    const minPrice = Number(filters.get("minPrice")) || 0;
    const maxPrice = Number(filters.get("maxPrice")) || Infinity;
    const maxKm = Number(filters.get("maxKm")) || Infinity;
    const fuel = normalize(filters.get("fuel"));
    const transmission = normalize(filters.get("transmission"));

    const filteredVehicles = allVehicles.filter(vehicle => {
        const matchesBrand = !brand || normalize(vehicle.brand) === brand;
        const matchesMinYear = !minYear || vehicle.year >= minYear;
        const matchesMaxYear = !filters.get("maxYear") || vehicle.year <= maxYear;
        const matchesMinPrice = !filters.get("minPrice") || vehicle.price >= minPrice;
        const matchesMaxPrice = !filters.get("maxPrice") || vehicle.price <= maxPrice;
        const matchesKm = !filters.get("maxKm") || vehicle.kilometers <= maxKm;
        const matchesFuel = !fuel || normalize(vehicle.fuel) === fuel;
        const matchesTransmission = !transmission || normalize(vehicle.transmission) === transmission;
        return matchesBrand && matchesMinYear && matchesMaxYear && matchesMinPrice && matchesMaxPrice && matchesKm && matchesFuel && matchesTransmission;
    });
    renderVehicles(filteredVehicles);
}

function renderVehicles(vehicles) {
    vehicleCount.textContent = `${vehicles.length} vehicles trobats`;

    if (vehicles.length === 0) {
        vehicleGrid.innerHTML = `<p class="empty-stock">No s'han trobat vehicles</p>`;
        return;
    }

    vehicleGrid.innerHTML = vehicles.map(vehicle => `
        <article class="vehicle-card">
            <div class="vehicle-card-image">
                <img src="${vehicle.images?.[0] || 'assets/images/hero-car.jpg'}" alt="${vehicle.brand} ${vehicle.model}">
            </div>

            <div class="vehicle-card-content">
                <h3>${vehicle.brand} ${vehicle.model}</h3>
                <p>${vehicle.year} · ${vehicle.kilometers.toLocaleString("ca-ES")} km</p>
                <p>${vehicle.fuel} · ${vehicle.transmission}</p>
                <p class="vehicle-card-price">${vehicle.price.toLocaleString("ca-ES")} €</p>
                <a href="vehicle.html?id=${encodeURIComponent(vehicle._id)}"class="btn-primary">Veure vehicle</a>
            </div>
        </article>
    `).join("");
}

async function loadVehicles() {
    try {
        const response = await fetch("/api/vehicles");
        if (!response.ok) throw new Error("Error en carregar els vehicles");
        allVehicles = await response.json();

        const initialFilters = getInitialFilters();
        fillFilters(initialFilters);
        filterVehicles();
    } catch (error) {
        console.error("Error:", error);
        vehicleGrid.innerHTML = `<p class="empty-stock">No s'han pogut carregar els vehicles. Torna-ho a intentar.</p>`;
    }
}

filtersForm.addEventListener("submit", event => {
    event.preventDefault();
    const params = new URLSearchParams(new FormData(filtersForm));
    for (const [key, value] of [...params.entries()]) if (!value) params.delete(key);

    const newUrl = params.toString() ? `stock.html?${params.toString()}` : "stock.html";
    window.history.replaceState({}, "", newUrl);
    filterVehicles();
});

filtersForm.addEventListener("reset", () => {
    setTimeout(() => { window.history.replaceState({}, "", "stock.html"); filterVehicles(); }, 0);
});

loadVehicles();
