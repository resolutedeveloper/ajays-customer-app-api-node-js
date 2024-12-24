const CryptoJS = require('crypto-js');
const secretKey = process.env.SECRET_KEY || '1211rh';  // Load secret key

// Encrypt data
const encryptData = (data) => {
  if (!data || typeof data !== 'string') {
    throw new Error('Invalid data for encryption');
  }
  try {
    return CryptoJS.AES.encrypt(data, secretKey).toString();
  } catch (error) {
    throw new Error('Encryption failed');
  }
};

// Decrypt data
const decryptData = (encryptedData) => {
  if (!encryptedData || typeof encryptedData !== 'string') {
    throw new Error('Invalid data for decryption');
  }
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedData) {
      throw new Error('Decryption resulted in empty string');
    }
    return decryptedData;
  } catch (error) {
    console.log("Decryption error:", error.message);
    throw new Error('Decryption failed');
  }
};

// Test encryption and decryption
const encryptedEmail = encryptData('harsh1@gmail.com');
const encryptedPhone = encryptData('9876543210');
console.log("Encrypted Email:", encryptedEmail);
console.log("Encrypted Phone:", encryptedPhone);

const decryptedEmail = decryptData(encryptedEmail);
const decryptedPhone = decryptData(encryptedPhone);

console.log("Decrypted Email:", decryptedEmail);
console.log("Decrypted Phone:", decryptedPhone);

