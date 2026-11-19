const sellForm = document.getElementById("sell-form");

if (sellForm) {
    sellForm.addEventListener("submit", async event => {
        event.preventDefault();

        const submitButton = sellForm.querySelector('[type="submit"]');

        if (submitButton?.disabled) return;
        const formData = new FormData(sellForm);
        try {
            if (submitButton) submitButton.disabled = true;
            const response = await fetch("/api/sell", { method: "POST", body: formData });
            let result;
            try {
                result = await response.json();
            } catch {
                throw new Error("El servidor ha enviat una resposta no vàlida.");
            }

            if (!response.ok) throw new Error(result.message || "Error al enviar la sol·licitud.");
            alert("La teua sol·licitud s'ha enviat correctament!");
            console.log("Sol·licitud guardada:", result);
            sellForm.reset();
        } catch (error) {
            console.error("Error en enviar la sol·licitud:", error);
            alert(error.message || "No s'ha pogut enviar la sol·licitud. Torna-ho a intentar.");
        } finally {
            if (submitButton) submitButton.disabled = false;
        }
    });
}
