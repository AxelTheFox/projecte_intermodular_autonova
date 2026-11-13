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

checkVehicleId();