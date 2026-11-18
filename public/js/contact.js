const contactForm = document.getElementById("contact-form");

contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);

    const contactData = {
        name: formData.get("name"), phone: formData.get("phone"),
        email: formData.get("email"), message: formData.get("message")
    };

    try {
        const response = await fetch("/api/contact", { method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify(contactData)});
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        alert("El teu missatge s'ha enviat correctament!");
        console.log("Missatge guardat:", result);
        contactForm.reset();
    } catch (error) {
        console.error("Error al enviar el missatge", error);
        alert("No s'ha pogut enviar el missatge. Torna-ho a intentar.");
    }    
});