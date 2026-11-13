const vehicleGrid = document.getElementById('vehicle-grid');
const vehicleCount = document.getElementById('vehicle-count');

function showEmptyStock() {
    if (vehicleGrid) {
        vehicleGrid.innerHTML = `
        <p class="empty-stock">Actualment no hi ha vehicles disponibles.</p>`;
    }
    
    if (vehicleCount) {
        vehicleCount.textContent = '0 vehicles trobats';
    }
}