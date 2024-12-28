const admin = require('firebase-admin');
require('dotenv').config();
const serviceAccount = require('../config/firebase.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: process.env.FIREBASE_DATABASE_URL, 
});

module.exports = admin;