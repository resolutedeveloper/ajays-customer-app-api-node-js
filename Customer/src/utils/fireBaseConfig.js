const admin = require('firebase-admin');
const fs = require('fs');
require("dotenv").config();


console.log("🚀 ~ process.env.FIREBASE_PROJECT_ID:", process.env.FIREBASE_PROJECT_ID);
console.log("🚀 ~ process.env.FIREBASE_CLIENT_EMAIL:", process.env.FIREBASE_CLIENT_EMAIL);


if (admin.apps.length === 0) {
  try {
    console.log('Initializing Firebase Admin...');

    // Validate required Firebase environment variables
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL) {
      throw new Error('Required Firebase environment variables are missing');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        type: process.env.FIREBASE_TYPE,
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: process.env.FIREBASE_AUTH_URI,
        token_uri: process.env.FIREBASE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
        client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
      })
    });

    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error.message);
  }
} else {
  console.log('Firebase Admin is already initialized');
}

module.exports = admin;
