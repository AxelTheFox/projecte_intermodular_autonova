
import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({

    // Característiques del vehicle
    brand: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    model: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    year: {
        type: Number,
        required: true,
        min: 1980,
        max: 2099
    },
    engine: {
        type: String,
        trim: true,
        maxlength: 50
    },
    power: {
        type: Number,
        min: 1,
        max: 2000
    },
    kilometers: {
        type: Number,
        required: true,
        min: 0,
        max: 2000000
    },
    fuel: {
        type: String,
        required: true,
        enum: ["Gasolina", "Dièsel", "Híbrid", "Elèctric", "GLP", "Altres"]
    },
    transmission: {
        type: String,
        required: true,
        enum: ["Manual", "Automàtic"]
    },
    registration: {
        type: String,
        trim: true,
        maxlength: 20
    },
    price: {
        type: Number,
        required: true,
        min: 1,
        max: 100000000
    },
    description: {
        type: String,
        trim: true,
        maxlength: 2000
    },
    images: {
        type: [String],
        default: [],
        validate: {
            validator: images => images.length <= 5,
            message: "Només es poden guardar 5 imatges com a màxim."
        }
    },
    available: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

const Vehicle =
    mongoose.models.Vehicle ||
    mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;