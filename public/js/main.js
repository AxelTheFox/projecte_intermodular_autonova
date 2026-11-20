const carousel = document.getElementById("featured-carousel");
if (carousel) {
    const image = document.getElementById("featured-image");
    const title = document.getElementById("featured-title");
    const price = document.getElementById("featured-price");
    const link = document.getElementById("featured-link");
    const prevButton = document.getElementById("carousel-prev");
    const nextButton = document.getElementById("carousel-next");
    const dotsContainer = document.getElementById("carousel-dots");
    let vehicles = [];
    let currentIndex = 0;
    let autoPlay;

    function getVehicleImage(vehicle) {
        const firstImage = Array.isArray(vehicle.images)
            ? vehicle.images[0]
            : null;

        const validImage = typeof firstImage === "string" &&
            (firstImage.startsWith("https://res.cloudinary.com/") || firstImage.startsWith("/uploads/vehicles/"));

        return validImage
            ? firstImage
            : "assets/images/hero-car.jpg";
    }

    function showVehicle(index) {
        if (vehicles.length === 0) return;
        currentIndex = (index + vehicles.length) % vehicles.length;
        const vehicle = vehicles[currentIndex];
        image.src = getVehicleImage(vehicle);
        image.alt = `${vehicle.brand || ""} ${vehicle.model || ""}`.trim();
        title.textContent = `${vehicle.brand || ""} ${vehicle.model || ""}`.trim();
        const vehiclePrice = Number(vehicle.price);
        price.textContent = Number.isFinite(vehiclePrice)
            ? new Intl.NumberFormat("ca-ES", {
                style: "currency",
                currency: "EUR",
                maximumFractionDigits: 0
            }).format(vehiclePrice)
            : "Preu no disponible";

        link.href = `vehicle.html?id=${encodeURIComponent(vehicle._id)}`;
        const dots = dotsContainer.querySelectorAll("button");

        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle("active", dotIndex === currentIndex);
            dot.setAttribute("aria-current", dotIndex === currentIndex ? "true" : "false");
        });
    }

    function createDots() {
        dotsContainer.replaceChildren();
        vehicles.forEach((vehicle, index) => {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.classList.add("carousel-dot");

            dot.setAttribute("aria-label", `Mostrar ${vehicle.brand || ""} ${vehicle.model || ""}`);
            dot.addEventListener("click", () => {
                showVehicle(index);
                restartAutoPlay();
            });
            dotsContainer.appendChild(dot);
        });
    }

    function startAutoPlay() {
        if (vehicles.length <= 1) return;
        autoPlay = setInterval(() => {
            showVehicle(currentIndex + 1);
        }, 5000);
    }

    function restartAutoPlay() {
        clearInterval(autoPlay);
        startAutoPlay();
    }

    prevButton.addEventListener("click", () => {
        showVehicle(currentIndex - 1);
        restartAutoPlay();
    });

    nextButton.addEventListener("click", () => {
        showVehicle(currentIndex + 1);
        restartAutoPlay();
    });

    async function loadFeaturedVehicles() {
        try {
            const response = await fetch("/api/vehicles");
            if (!response.ok) throw new Error("No s'han pogut carregar els vehicles.");
            const data = await response.json();
            if (!Array.isArray(data)) throw new Error("Les dades dels vehicles no són vàlides.");
            vehicles = data;
            if (vehicles.length === 0) {
                title.textContent = "Pròximament, nous vehicles disponibles";
                price.textContent = "";
                link.href = "stock.html";
                link.textContent = "Consultar estoc";
                prevButton.hidden = true;
                nextButton.hidden = true;
                dotsContainer.replaceChildren();
                return;
            }

            createDots();
            showVehicle(0);
            startAutoPlay();
        } catch (error) {
            console.error("Error en carregar el carrusel:", error);
            title.textContent = "Descobreix els nostres vehicles";
            price.textContent = "";
            link.href = "stock.html";
            link.textContent = "Veure vehicles";
            prevButton.hidden = true;
            nextButton.hidden = true;
            dotsContainer.replaceChildren();
        }
    }

    loadFeaturedVehicles();
}

const searchForm = document.querySelector(".car-search");
if (searchForm) {
    searchForm.addEventListener("submit", event => {
        event.preventDefault();
        const brand = document.getElementById("brand").value;
        const year = document.getElementById("year").value;
        const maxPrice = document.getElementById("max-price").value;
        const searchParams = new URLSearchParams();
        if (brand) searchParams.set("brand", brand);
        if (year) searchParams.set("year", year);
        if (maxPrice) searchParams.set("maxPrice", maxPrice);
        window.location.href = `stock.html?${searchParams.toString()}`;
    });
}
