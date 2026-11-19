
const contactForm = document.getElementById("contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", async event => {
        event.preventDefault();
        const submitButton = contactForm.querySelector('[type="submit"]');
        if (submitButton?.disabled) return;
        const formData = new FormData(contactForm);
        const contactData = {
            name: formData.get("name"),
            phone: formData.get("phone"),
            email: formData.get("email"),
            message: formData.get("message")
        };

        try {
            if (submitButton) submitButton.disabled = true;
            const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(contactData) });
            let result;
            try {
                result = await response.json();
            } catch {
                throw new Error("El servidor ha enviat una resposta no vàlida.");
            }

            if (!response.ok) throw new Error(result.message || "Error en enviar el missatge.");
            alert("El teu missatge s'ha enviat correctament!");
            console.log("Missatge guardat:", result);
            contactForm.reset();
        } catch (error) {
            console.error("Error en enviar el missatge:", error);

            alert(error.message || "No s'ha pogut enviar el missatge. Torna-ho a intentar.");
        } finally {
            if (submitButton) submitButton.disabled = false;
        }
    });
}