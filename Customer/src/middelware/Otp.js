require('dotenv').config();

function generateOTP() {
    const length = process.env.OTPDIGITS; // Length of the OTP
    const characters = '0123456789'; // Characters to use for generating the OTP
    let otp = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        otp += characters[randomIndex];
    }
    return otp;
}

module.exports = { generateOTP };