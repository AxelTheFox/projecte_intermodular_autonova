
const vehicleGallery = document.getElementById("vehicle-gallery");
const vehicleDescription = document.getElementById("vehicle-description");

const urlParams = new URLSearchParams(window.location.search);
const vehicleId = urlParams.get("id");

// Crear elements HTML de manera segura.
function createElement(tag, className = "", text = "") {
    const element = document.createElement(tag);

    if (className) element.className = className;

    element.textContent = String(text ?? "");

    return element;
}

// Mostrar un missatge d'error.
function showMessage(message) {
    vehicleDescription.replaceChildren();

    vehicleDescription.appendChild(
        createElement("p", "", message)
    );

    const link = createElement("a", "", "Tornar al catàleg");
    link.href = "stock.html";

    vehicleDescription.appendChild(link);
}

function checkVehicleId() {
    if (!vehicleId) {
        showMessage("No s'ha especificat cap vehicle.");
        return false;
    }

    return true;
}

// Mostrar les fotografies.
function displayGallery(vehicle) {
    vehicleGallery.replaceChildren();

    if (Array.isArray(vehicle.images) && vehicle.images.length > 0) {
        vehicle.images.forEach(image => {
            // Només acceptem rutes locals d'imatges pujades.
            if (
                typeof image !== "string" ||
                !image.startsWith("/uploads/vehicles/")
            ) {
                return;
            }

            const img = document.createElement("img");
            img.src = image;
            img.alt = `${vehicle.brand || ""} ${vehicle.model || ""}`.trim();

            vehicleGallery.appendChild(img);
        });

        if (vehicleGallery.children.length === 0) {
            vehicleGallery.appendChild(
                createElement("p", "", "Aquest vehicle encara no té fotografies.")
            );
        }
    } else {
        vehicleGallery.appendChild(
            createElement("p", "", "Aquest vehicle encara no té fotografies.")
        );
    }
}

// Mostrar les dades del vehicle.
function displayVehicle(vehicle) {
    vehicleDescription.replaceChildren();

    const title = createElement(
        "h1",
        "",
        `${vehicle.brand || ""} ${vehicle.model || ""}`.trim()
    );

    const priceValue = Number(vehicle.price);
    const price = createElement(
        "p",
        "vehicle-detail-price",
        Number.isFinite(priceValue)
            ? `${priceValue.toLocaleString("ca-ES")} €`
            : "Preu no disponible"
    );

    const specifications = createElement("div", "vehicle-specifications");

    const addSpecification = (label, value) => {
        const paragraph = document.createElement("p");
        const strong = createElement("strong", "", `${label}: `);

        paragraph.append(
            strong,
            document.createTextNode(String(value ?? "—"))
        );

        specifications.appendChild(paragraph);
    };

    addSpecification("Any", vehicle.year);
    addSpecification("Motor", vehicle.engine);
    addSpecification(
        "Potència",
        vehicle.power != null ? `${vehicle.power} CV` : "—"
    );

    const kilometers = Number(vehicle.kilometers);

    addSpecification(
        "Quilòmetres",
        Number.isFinite(kilometers)
            ? `${kilometers.toLocaleString("ca-ES")} km`
            : "—"
    );

    addSpecification("Combustible", vehicle.fuel);
    addSpecification("Canvi", vehicle.transmission);

    const descriptionContainer = createElement(
        "div",
        "vehicle-detail-description"
    );

    const descriptionTitle = createElement("h2", "", "Descripció");

    const descriptionText = createElement(
        "p",
        "",
        vehicle.description || "Aquest vehicle no té cap descripció."
    );

    descriptionContainer.append(descriptionTitle, descriptionText);

    const contactLink = createElement(
        "a",
        "btn-primary",
        "Contactar amb nosaltres"
    );

    contactLink.href = "contact.html";

    vehicleDescription.append(
        title,
        price,
        specifications,
        descriptionContainer,
        contactLink
    );
}

async function loadVehicle() {
    if (!checkVehicleId()) return;

    try {
        const response = await fetch(
            `/api/vehicles/${encodeURIComponent(vehicleId)}`
        );

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("No s'ha trobat aquest vehicle.");
            }

            throw new Error("Error al carregar el vehicle.");
        }

        const vehicle = await response.json();

        displayGallery(vehicle);
        displayVehicle(vehicle);

    } catch (error) {
        console.error("Error al carregar el vehicle:", error);

        vehicleGallery.replaceChildren();
        showMessage(error.message);
    }
}

loadVehicle();