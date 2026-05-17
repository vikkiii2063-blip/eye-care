const mongoose = require('mongoose');

const DonorSchema = new mongoose.Schema({
    donorId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    sex: { type: String, required: true },
    health: { type: String },
    contact: { type: String, required: true }, // Vignesh added contact detail field
    status: { type: String, default: 'Available' },
    image: { type: String, default: 'https://cdn-icons-png.flaticon.com/512/822/822102.png' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donor', DonorSchema);