const sellForm = document.getElementById('sell-form');

sellForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(sellForm);

    const vehicleData = {
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
        images: formData.getAll('images')
    }

    const ownerData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone')
    };

    console.log('Dades del vehicle preparades:', {
        ...vehicleData, images: `${vehicleData.images.length} fotografies`
    });

    console.log('Dades del propietari prearades correctament.');
});