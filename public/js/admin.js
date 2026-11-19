const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");
const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("admin-username");
const passwordInput = document.getElementById("admin-password");
const loginError = document.getElementById("login-error");
const loginButton = document.getElementById("login-button");
const logoutButton = document.getElementById("logout-button");
const requestList = document.getElementById("request-list");
const requestCount = document.getElementById("request-count");

if (
    !loginSection || !dashboardSection || !loginForm || !usernameInput ||
    !passwordInput || !loginError || !loginButton || !logoutButton ||
    !requestList || !requestCount
) {
    console.error("No s'han trobat tots els elements del panell d'administració.");
} else {

async function readResponse(response) {
    try {
        return await response.json();
    } catch {
        throw new Error("El servidor ha enviat una resposta no vàlida.");
    }
}

function showLogin(message = "") {
    loginSection.hidden = false;
    dashboardSection.hidden = true;
    logoutButton.hidden = true;
    loginError.textContent = message;
    loginError.hidden = !message;
}

function showDashboard() {
    loginSection.hidden = true;
    dashboardSection.hidden = false;
    logoutButton.hidden = false;
    loadRequests();
}

function formatNumber(value) {
    const number = Number(value);
    return Number.isFinite(number)
        ? number.toLocaleString("ca-ES")
        : "—";
}

function createElement(tag, className = "", text = "") {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = String(text ?? "");
    return element;
}

function addDetail(container, label, value) {
    const paragraph = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = `${label}: `;
    paragraph.append(strong, document.createTextNode(String(value ?? "—")));
    container.appendChild(paragraph);
}

async function checkSession() {
    try {
        const response = await fetch("/api/auth/me");
        const result = await readResponse(response);
        if (response.ok && result.isAdmin === true) showDashboard();
        else showLogin();
    } catch (error) {
        console.error("Error en comprovar la sessió:", error);
        showLogin("No s'ha pogut comprovar la sessió. Torna-ho a provar.");
    }
}

loginForm.addEventListener("submit", async event => {
    event.preventDefault();
    if (loginButton.disabled) return;
    loginButton.disabled = true;
    loginError.hidden = true;
    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: usernameInput.value.trim(), password: passwordInput.value })
        });

        const result = await readResponse(response);
        if (!response.ok) throw new Error(result.message || "No s'ha pogut iniciar la sessió.");
        loginForm.reset();
        showDashboard();
    } catch (error) {
        loginError.textContent = error.message || "Error en iniciar sessió.";
        loginError.hidden = false;
    } finally {
        loginButton.disabled = false;
    }
});

logoutButton.addEventListener("click", async () => {
    if (logoutButton.disabled) return;
    logoutButton.disabled = true;
    try {
        const response = await fetch("/api/auth/logout", { method: "POST" });
        const result = await readResponse(response);
        if (!response.ok) throw new Error(result.message || "No s'ha pogut tancar la sessió.");
        requestList.replaceChildren();
        requestCount.textContent = "0 sol·licituds";
        showLogin();
    } catch (error) {
        console.error("Error en tancar la sessió:", error);
        alert(error.message || "No s'ha pogut tancar la sessió.");
    } finally {
        logoutButton.disabled = false;
    }
});

async function loadRequests() {
    try {
        const response = await fetch("/api/admin/requests");
        if (response.status === 401) {
            showLogin("La sessió ha caducat. Torna a iniciar sessió.");
            return;
        }
        if (!response.ok) throw new Error("Error en carregar les sol·licituds.");
        const requests = await readResponse(response);
        if (!Array.isArray(requests)) throw new Error("Les dades de les sol·licituds no són vàlides.");

        requestCount.textContent = `${requests.length} sol·licituds`;
        requestList.replaceChildren();
        if (requests.length === 0) {
            requestList.appendChild(createElement("p", "empty-stock", "Encara no hi ha sol·licituds de venda."));
            return;
        }

        requests.forEach(request => {
            const vehicle = request.vehicle || {};
            const owner = request.owner || {};
            const card = createElement("article", "request-card");
            const header = createElement("div", "request-card-header");
            const title = createElement("h3", "", `${vehicle.brand || "Vehicle"} ${vehicle.model || ""}`.trim());
            const allowedStatuses = ["pending", "accepted", "rejected"];
            const status = allowedStatuses.includes(request.status)
                ? request.status
                : "unknown";
            const statusLabel = { pending: "Pendent", accepted: "Acceptada", rejected: "Rebutjada" };
            const statusElement = createElement("span", `request-status status-${status}`, statusLabel[status] || "Desconegut");
            header.append(title, statusElement);
            card.appendChild(header);
            const details = createElement("div", "request-card-details");
            const vehicleDetails = document.createElement("div");

            vehicleDetails.appendChild(createElement("h4", "", "Dades del vehicle"));
            addDetail(vehicleDetails, "Any", vehicle.year);
            addDetail(vehicleDetails, "Motor", vehicle.engine);

            addDetail(vehicleDetails, "Potència", vehicle.power != null ? `${vehicle.power} CV` : "—");
            addDetail(vehicleDetails, "Quilòmetres", vehicle.kilometers != null
                ? `${formatNumber(vehicle.kilometers)} km`
                : "—"
            );

            addDetail(vehicleDetails, "Combustible", vehicle.fuel);
            addDetail(vehicleDetails, "Canvi", vehicle.transmission);

            addDetail(vehicleDetails, "Preu sol·licitat", vehicle.price != null
                ? `${formatNumber(vehicle.price)} €`
                : "—"
            );

            const ownerDetails = document.createElement("div");
            ownerDetails.appendChild(createElement("h4", "", "Dades del propietari"));
            addDetail(ownerDetails, "Nom", `${owner.firstName || ""} ${owner.lastName || ""}`.trim() || "—");
            addDetail(ownerDetails, "Email", owner.email);
            addDetail(ownerDetails, "Telèfon", owner.phone);
            details.append(vehicleDetails, ownerDetails);
            card.appendChild(details);

            if (status === "pending") {
                const actions = createElement("div", "request-card-actions");
                const acceptButton = createElement("button", "btn-accept", "Acceptar");
                acceptButton.type = "button";
                const rejectButton = createElement("button", "btn-reject", "Rebutjar");
                rejectButton.type = "button";
                acceptButton.addEventListener("click", () => {
                    manageRequest(request._id, "accept", acceptButton, rejectButton);
                });

                rejectButton.addEventListener("click", () => {
                    manageRequest(request._id, "reject", acceptButton, rejectButton);
                });

                actions.append(acceptButton, rejectButton);
                card.appendChild(actions);
            }
            requestList.appendChild(card);
        });
    } catch (error) {
        console.error("Error en carregar les sol·licituds:", error);
        requestList.replaceChildren(
            createElement("p", "empty-stock", "No s'han pogut carregar les sol·licituds.")
        );
    }
}

async function manageRequest(requestId, action, acceptButton, rejectButton) {
    if (!["accept", "reject"].includes(action)) return;
    const confirmation = confirm(action === "accept"
        ? "Vols acceptar aquesta sol·licitud i publicar el vehicle?"
        : "Vols rebutjar aquesta sol·licitud?"
    );

    if (!confirmation) return;
    acceptButton.disabled = true;
    rejectButton.disabled = true;

    try {
        const response = await fetch(`/api/admin/requests/${encodeURIComponent(requestId)}/${action}`, { method: "PUT" });
        const result = await readResponse(response);
        if (response.status === 401) {
            showLogin("La sessió ha caducat. Torna a iniciar sessió.");
            return;
        }

        if (!response.ok) throw new Error(result.message || "No s'ha pogut gestionar la sol·licitud.");
        alert(result.message);
        await loadRequests();
    } catch (error) {
        console.error("Error en gestionar la sol·licitud:", error);
        alert(error.message || "Error en gestionar la sol·licitud.");
    } finally {
        acceptButton.disabled = false;
        rejectButton.disabled = false;
    }
}
checkSession();
}