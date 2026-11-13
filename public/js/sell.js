const sellForm = document.getElementById('sell-form');

sellForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(sellForm);
    const sellData = {
        brand: formData.get('brand'),
        model: formData.get('model'),
        year: formData.get('year'),
        engine: formData.get('engine'),
        power: formData.get('power'),
        kilometers: formData.get('kilometers'),
        fuel: formData.get('fuel'),
        transmission: formData.get('transmission'),
        registration: formData.get('registration'),
        price: formData.get('price'),
        description: formData.get('description'),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone')
    };

    try {
        const response = await fetch('/api/sell', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sellData)
        });

        const result = await response.json();
        if (!response.ok) { throw new Error(result.message); }

        alert('La teua sol·licitud s\'ha enviat correctament!');
        console.log('Sol·licitud guardada:', result);
        sellForm.reset();
    } catch (error) {
        console.error('Error en enviar la sol·licitud:', error);
        alert('No s\'ha pogut enviar la sol·licitud. Torna-ho a intentar.');
    }
});
