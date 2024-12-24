const db = require('../models');
const CryptoJS = require('crypto-js');
const CUSTOMER = db.customer;
const secretKey = process.env.SECRET_KEY;


function encryptData(data) {
  if (!data) {
    throw new Error("No data provided to encrypt");
  }
  return CryptoJS.AES.encrypt(data, secretKey).toString();
}


const decryptData = (encryptedData) => {
  if (!encryptedData || typeof encryptedData !== 'string') {
    throw new Error('Invalid data for decryption');
  }
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);   // convert bytes data into string
    
    if (!decryptedData) {
      throw new Error('Decryption resulted in empty string');
    }

    return decryptedData;
  } catch (error) {
    throw new Error('Decryption failed');
  }
};



module.exports = { encryptData, decryptData };
