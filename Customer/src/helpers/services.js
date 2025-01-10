// Service for encryption and decryption

const CryptoJS = require('crypto-js');
const secretKey = process.env.CRYPTOJSKEY;

// Encryption
const encryption = (textToEncrypt) => {
    if(!textToEncrypt || textToEncrypt.trim() === ""){
        return false;    
    }
    return CryptoJS.AES.encrypt(textToEncrypt).toString();
}

// Decryption
const decryption = (encryptedText) => {
    if(!encryptedText || encryptedText.trim() === ""){
        return false;
    }
    const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

// All other services mention below



// exporting all services
module.exports = { encryption, decryption };