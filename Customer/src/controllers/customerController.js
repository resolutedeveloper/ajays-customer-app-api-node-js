const db = require('../models');
const { decryptData, encryptData } = require('../utils/cryptoUtils');
const CUSTOMER = db.customer;
const CustomerEmail = db.customerEmail;
const CustomerMobile = db.customerMobile;
const logger = require('../utils/logger');
const Joi = require('joi');

const createCustomer = async (req ,res) =>{
    try {
        // const customer = await CUSTOMER.findOne()

        const customer = await CUSTOMER.create(req.body);
        logger.info("Customer created: ", JSON.stringify(customer));

        res.status(201).json(customer);
    } catch (err) {
        logger.error(`Error creating Customer: ${err}`);
        res.status(500).json({ success: false, message: "Error creating Customer", error: err.message, });
    }

}



const loginCustomer = async (req, res) => {
  console.log("🚀 ~ Incoming request body:", req.body);

  try {
    const schema = Joi.object({
      EmailID: Joi.string().email().required(),
    });

    const { EmailID } = await schema.validateAsync(req.body);

    let decryptedEmail = EmailID;

    if (isEncrypted(EmailID)) {
      try {
        decryptedEmail = decryptData(EmailID);
        console.log("🚀 ~ Decrypted Email:", decryptedEmail);
      } catch (decryptionError) {
        console.error("🚀 ~ Decryption failed for Email:", decryptionError.message);
        return res.status(400).json({ message: "Invalid encrypted EmailID provided." });
      }
    } else {
      console.log("🚀 ~ Email is not encrypted, using as is.");
    }

    const customerIDFromToken = req.UserDetail.CustomerID;
    const phoneNumberFromToken = req.UserDetail.PhoneNumber;
    console.log("🚀 ~ loginCustomer ~ phoneNumberFromToken:", phoneNumberFromToken)

    if (!customerIDFromToken || !phoneNumberFromToken) {
      return res.status(400).json({ message: "CustomerID or PhoneNumber is missing in the token." });
    }

    let decryptedPhone = phoneNumberFromToken;

    // Decrypt phone number only if it is encrypted
    if (isEncrypted(phoneNumberFromToken)) {
      try {
        decryptedPhone = decryptData(phoneNumberFromToken);
        console.log("🚀 ~ Decrypted Phone from Token:", decryptedPhone);
      } catch (decryptionError) {
        console.error("🚀 ~ Decryption failed for PhoneNumber:", decryptionError.message);
        return res.status(400).json({ message: "Invalid encrypted PhoneNumber provided." });
      }
    } else {
      console.log("🚀 ~ Phone number is not encrypted, using as is.");
    }

    console.log("🚀 ~ Preparing to insert email:", decryptedEmail);

    if (!decryptedEmail) {
      console.error("🚀 ~ Error: Decrypted email is null or empty.");
      return res.status(400).json({ message: "Decrypted email cannot be null or empty." });
    }

    const existingEmail = await CustomerEmail.findOne({
      where: { EmailId: decryptedEmail },
    });

    if (existingEmail) {
      console.log("🚀 ~ Email already exists.");
      return res.status(200).json({
        message: "Email already exists.",
        email: encryptData(decryptedEmail),
        phone: decryptedPhone,
      });
    }

    const emailRecord = await CustomerEmail.create({
      CustomerID: customerIDFromToken,
      EmailID: decryptedEmail,
      IsDeleted: false,
    });
    console.log("🚀 ~ Email record created:", emailRecord);

    // Store phone number in decrypted
    const phoneRecord = await CustomerMobile.create({
      CustomerID: customerIDFromToken,
      PhoneNumber: decryptedPhone,
      IsDeleted: false,
    });
    console.log("🚀 ~ loginCustomer ~ phoneRecord:", phoneRecord)

    res.status(200).json({
      message: "Login successful",
      email: encryptData(decryptedEmail),
      phone: decryptedPhone,
    });
  } catch (error) {
    console.error("🚀 ~ Error:", error.message);
    res.status(400).json({ message: "Error during processing", error: error.message });
  }
};

function isEncrypted(data) {
  return typeof data === "string" && data.startsWith("U2FsdGVkX1+");
}




module.exports = {createCustomer, loginCustomer};