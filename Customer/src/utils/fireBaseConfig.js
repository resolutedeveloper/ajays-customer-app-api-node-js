const admin = require('firebase-admin');
const fs = require('fs');
require("dotenv").config();


console.log("🚀 ~  process.env.FIREBASE_APNS_BUNDLE_ID,:",  process.env.FIREBASE_APNS_BUNDLE_ID,)
console.log("🚀 ~ process.env.FIREBASE_APNS_TEAM_ID,:", process.env.FIREBASE_APNS_TEAM_ID,)
console.log("🚀 ~ process.env.FIREBASE_APNS_KEY_ID,:", process.env.FIREBASE_APNS_KEY_ID,)
// Initialize Firebase Admin SDK
try {
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
    }),
    apns: {
      key: fs.readFileSync(process.env.APNS_KEY_PATH, 'utf8'),
      keyId: process.env.FIREBASE_APNS_KEY_ID,
      teamId: process.env.FIREBASE_APNS_TEAM_ID,
      bundleId: process.env.FIREBASE_APNS_BUNDLE_ID,
    }
  });
  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin:', error.message);
}


module.exports = admin;

