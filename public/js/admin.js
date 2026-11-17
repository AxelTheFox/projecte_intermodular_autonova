
const requestList = document.getElementById('request-list');
const requestCount = document.getElementById('request-count');

async function loadRequests() {
    try {
        const response = await fetch('/api/admin/requests');
        if (!response.ok) throw new Error('Error en carregar les sol·licituds.');
        const requests = await response.json();
        requestCount.textContent = `${requests.length} sol·licituds`;

        if (requests.length === 0) {
            requestList.innerHTML = `<p class="empty-stock">Encara no hi ha sol·licituds de venda.</p>`;
            return;
        }

        requestList.innerHTML = requests.map(request => `
            <article class="request-card">
                <div class="request-card-header">
                    <h3>${request.vehicle.brand} ${request.vehicle.model}</h3>
                    <span class="request-status status-${request.status}">${request.status}</span>
                </div>

                <div class="request-card-details">
                    <div>
                        <h4>Dades del vehicle</h4>
                        <p><strong>Any:</strong> ${request.vehicle.year}</p>
                        <p><strong>Motor:</strong> ${request.vehicle.engine}</p>
                        <p><strong>Potència:</strong> ${request.vehicle.power} CV</p>
                        <p><strong>Quilòmetres:</strong> ${request.vehicle.kilometers.toLocaleString('ca-ES')} km</p>
                        <p><strong>Combustible:</strong> ${request.vehicle.fuel}</p>
                        <p><strong>Canvi:</strong> ${request.vehicle.transmission}</p>
                        <p><strong>Preu sol·licitat:</strong> ${request.vehicle.price.toLocaleString('ca-ES')} €</p>
                    </div>

                    <div>
                        <h4>Dades del propietari</h4>
                        <p><strong>Nom:</strong> ${request.owner.firstName} ${request.owner.lastName}</p>
                        <p><strong>Email:</strong> ${request.owner.email}</p>
                        <p><strong>Telèfon:</strong> ${request.owner.phone}</p>
                    </div>
                </div>

                ${request.status === 'pending' ? `
                    <div class="request-card-actions">
                        <button class="btn-accept" onclick="manageRequest('${request._id}', 'accept')">Acceptar</button>
                        <button class="btn-reject" onclick="manageRequest('${request._id}', 'reject')">Rebutjar</button>
                    </div>` : ''
                }
            </article>
        `).join('');

    } catch (error) {
        console.error('Error:', error);
        requestList.innerHTML = `<p class="empty-stock">No s'han pogut carregar les sol·licituds.</p>`;
    }
}

// Acceptar o rebutjar una sol·licitud
async function manageRequest(requestId, action) {
    const confirmation = confirm(
        action === 'accept'
            ? 'Vols acceptar aquesta sol·licitud i publicar el vehicle?'
            : 'Vols rebutjar aquesta sol·licitud?'
    );

    if (!confirmation) return;

    try {
        const response = await fetch(`/api/admin/requests/${requestId}/${action}`, { method: 'PUT' });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        alert(result.message);
        loadRequests();
    } catch (error) {
        console.error('Error en gestionar la sol·licitud:', error);
        alert(error.message);
    }
}

loadRequests();
