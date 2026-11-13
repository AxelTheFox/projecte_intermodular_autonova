import mongoose from "mongoose";

const sellRequestSchema = new mongoose.Schema({
    vehicle: {
        brand: { type: String, required: true, trim: true },
        model: { type: String, required: true, trim: true },
        year: { type: Number, required: true },
        engine: { type: String, required: true, trim: true },
        power: { type: Number, required: true, min: 1 },
        kilometers: { type: Number, required: true, min: 0 },
        fuel: { type: String, required: true },
        transmission: { type: String, required: true },
        registration: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        description: { type: String, required: true, trim: true }
    },

    owner: {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        phone: { type: String, required: true, trim: true }
    },
    
    images: { type: [String], default:[] },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
}, {
    timestamps: true
});

const sellRequest = mongoose.models.sellRequest || mongoose.model('SellRequest', sellRequestSchema);
export default sellRequest;