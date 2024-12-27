const admin = require('firebase-admin');
require('dotenv').config();
const serviceAccount = require('../config/firebase.json'); // Replace with the path to your Firebase service account key

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: process.env.FIREBASE_DATABASE_URL,  // Optional if using Firebase Realtime Database
});

module.exports = admin;