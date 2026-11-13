import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({

    // Característiques del vehicle
    brand: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    engine: { type: String, required: true, trim: true },
    power: { type: Number, required: true },
    kilometers: { type: Number, required: true, min: 0 },
    fuel: { type: String, required: true },
    transmission: { type: String, required: true },
    registration: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    available: { type: Boolean, default: true }
}, {
    timestamps: true
});

const Vehicle = mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;
