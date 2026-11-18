const sellForm = document.getElementById('sell-form');

sellForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(sellForm);

    try {
        const response = await fetch('/api/sell', { method: 'POST', body: formData });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Error al enviar la sol·licitud");

        alert("La teua sol·licitud s'ha enviat correctament!");
        console.log('Sol·licitud guardada:', result);
        sellForm.reset();
    } catch (error) {
        console.error("Error en enviar la sol·licitud:", error);
        alert("No s'ha pogut enviar la sol·licitud. Torna-ho a intentar.");
    }
});
