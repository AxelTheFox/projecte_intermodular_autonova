import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ['pending', 'read', 'answered'], default: 'pending' }
}, {
    timestamps: true
});

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);
export default ContactMessage;