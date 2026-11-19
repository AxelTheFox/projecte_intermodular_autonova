const vehicleGrid = document.getElementById("vehicle-grid");
const vehicleCount = document.getElementById("vehicle-count");
const filtersForm = document.querySelector(".filters-form");

let allVehicles = [];

function normalize(value) {
    return String(value ?? "").trim().toLowerCase();
}

function createElement(tag, className = "", text = "") {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = String(text ?? "");
    return element;
}

function formatNumber(value) {
    const number = Number(value);
    return Number.isFinite(number)
        ? number.toLocaleString("ca-ES")
        : "—";
}

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
    if (homeYear && !filters.minYear && !filters.maxYear) {
        filters.minYear = homeYear;
        filters.maxYear = homeYear;
    }
    return filters;
}

function fillFilters(filters) {
    Object.entries(filters).forEach(([name, value]) => {
        const field = filtersForm.elements.namedItem(name);
        if (field) field.value = value;
    });
}

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
        const matchesMinYear = !filters.get("minYear") || vehicle.year >= minYear;
        const matchesMaxYear = !filters.get("maxYear") || vehicle.year <= maxYear;
        const matchesMinPrice = !filters.get("minPrice") || vehicle.price >= minPrice;
        const matchesMaxPrice = !filters.get("maxPrice") || vehicle.price <= maxPrice;
        const matchesKm = !filters.get("maxKm") || vehicle.kilometers <= maxKm;
        const matchesFuel = !fuel || normalize(vehicle.fuel) === fuel;
        const matchesTransmission = !transmission || normalize(vehicle.transmission) === transmission;
        return (
            matchesBrand && matchesMinYear && matchesMaxYear && matchesMinPrice && matchesMaxPrice &&
            matchesKm && matchesFuel && matchesTransmission
        );
    });
    renderVehicles(filteredVehicles);
}

function renderVehicles(vehicles) {
    vehicleCount.textContent = `${vehicles.length} vehicles trobats`;
    vehicleGrid.replaceChildren();

    if (vehicles.length === 0) {
        vehicleGrid.appendChild(createElement("p", "empty-stock", "No s'han trobat vehicles"));
        return;
    }

    vehicles.forEach(vehicle => {
        const card = createElement("article", "vehicle-card");
        const imageContainer = createElement("div", "vehicle-card-image");
        const image = document.createElement("img");
        const firstImage = Array.isArray(vehicle.images)
            ? vehicle.images[0]
            : null;

        image.src = typeof firstImage === "string" && firstImage.trim()
            ? firstImage
            : "assets/images/hero-car.jpg";

        image.alt = `${vehicle.brand || ""} ${vehicle.model || ""}`.trim();
        imageContainer.appendChild(image);
        const content = createElement("div", "vehicle-card-content");
        const title = createElement("h3", "", `${vehicle.brand || ""} ${vehicle.model || ""}`.trim());
        const yearAndKm = createElement("p", "", `${vehicle.year ?? "—"} · ${formatNumber(vehicle.kilometers)} km`);
        const fuelAndTransmission = createElement("p", "", `${vehicle.fuel || "—"} · ${vehicle.transmission || "—"}`);
        const price = createElement("p", "vehicle-card-price", `${formatNumber(vehicle.price)} €`);
        const link = createElement("a", "btn-primary", "Veure vehicle");
        link.href = `vehicle.html?id=${encodeURIComponent(vehicle._id)}`;

        content.append(title, yearAndKm, fuelAndTransmission, price, link);
        card.append(imageContainer, content);
        vehicleGrid.appendChild(card);
    });
}

async function loadVehicles() {
    try {
        const response = await fetch("/api/vehicles");
        if (!response.ok) throw new Error("Error en carregar els vehicles");
        const vehicles = await response.json();
        if (!Array.isArray(vehicles)) throw new Error("Les dades dels vehicles no són vàlides.");
        allVehicles = vehicles;
        const initialFilters = getInitialFilters();
        fillFilters(initialFilters);
        filterVehicles();
    } catch (error) {
        console.error("Error:", error);
        vehicleGrid.replaceChildren(createElement("p", "empty-stock", "No s'han pogut carregar els vehicles. Torna-ho a intentar."));
    }
}

filtersForm.addEventListener("submit", event => {
    event.preventDefault();
    const params = new URLSearchParams(new FormData(filtersForm));
    for (const [key, value] of [...params.entries()]) if (!value) params.delete(key);
    const newUrl = params.toString()
        ? `stock.html?${params.toString()}`
        : "stock.html";
    window.history.replaceState({}, "", newUrl);
    filterVehicles();
});

filtersForm.addEventListener("reset", () => {
    setTimeout(() => {
        window.history.replaceState({}, "", "stock.html");
        filterVehicles();
    }, 0);
});

loadVehicles();