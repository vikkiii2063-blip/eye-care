const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const Donor = require('./models/Donor');
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully!'))
    .catch(err => console.error('DB Connection Error:', err));

// API Endpoint 1: Register New Donor with Contact (POST)
app.post('/api/donors', async (req, res) => {
    try {
        const { name, age, sex, health, contact } = req.body;
        const donorId = "EYE-" + Math.floor(Math.random() * 10000);

        const newDonor = new Donor({ donorId, name, age, sex, health, contact });
        await newDonor.save();

        res.status(201).json({ success: true, message: 'Donor registered!', donorId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// API Endpoint 2: Fetch Available Eyes Grid (GET)
app.get('/api/donors', async (req, res) => {
    try {
        const donors = await Donor.find().sort({ createdAt: -1 });
        res.status(200).json(donors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API Endpoint 3: Doctor Auth Simulation Login
app.post('/api/doctor/login', (req, res) => {
    const { username, password } = req.body;
    // Classic simple doctor login check
    if (username === 'doctor' && password === 'admin123') {
        res.json({ success: true, token: 'doc-session-secured-token' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid Credentials' });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));