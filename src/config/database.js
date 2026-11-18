import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connectat correctament.");
    } catch (error) {
        console.error("Error al connectar amb MongoDB:", error.message);
        process.exit(1);
    }
};

export default connectDB;