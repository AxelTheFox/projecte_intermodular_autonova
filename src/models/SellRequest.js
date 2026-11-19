import mongoose from "mongoose";

const sellRequestSchema = new mongoose.Schema({
    vehicle: {
        brand: { type: String, required: true, trim: true },
        model: { type: String, required: true, trim: true },
        year: { type: Number, required: true },
        engine: { type: String, trim: true },
        power: { type: Number, min: 1 },
        kilometers: { type: Number, required: true, min: 0 },
        fuel: { type: String, required: true, enum: ["Gasolina", "Dièsel", "Híbrid", "Elèctric", "GLP", "Altres"] },
        transmission: { type: String, required: true, enum: ["Manual", "Automàtic"] },
        registration: { type: String, trim: true, maxlength: 20 },
        price: { type: Number, required: true, min: 1, max: 100000000 },
        description: { type: String, trim: true, maxlength: 2000 }
    },

    owner: {
        firstName: { type: String, required: true, trim: true, maxlength: 50 },
        lastName: { type: String, required: true, trim: true, maxlength: 80 },
        email: { type: String, required: true, trim: true, lowercase: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        phone: { type: String, required: true, trim: true, minlength: 6, maxlength: 20 }
    },
    
    images: { type: [String], default:[], validate: { validator: images => images.length <= 5, message: "Només es poden guardar 5 imatges com a màxim"} },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
}, {
    timestamps: true
});

const sellRequest = mongoose.models.sellRequest || mongoose.model('SellRequest', sellRequestSchema);
export default sellRequest;