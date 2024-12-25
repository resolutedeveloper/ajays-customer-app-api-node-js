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
      EmailID: Joi.string().required(),
    });

    const { EmailID } = await schema.validateAsync(req.body);

    let decryptedEmail = EmailID;

    // Decrypt email if encrypted
    if (isEncrypted(EmailID)) {
      decryptedEmail = decryptData(EmailID);
    }

    console.log("🚀 ~ Decrypted Email:", decryptedEmail);

    const customerIDFromToken = req.UserDetail.CustomerID;
    const phoneNumberFromToken = req.UserDetail.PhoneNumber;

    if (!customerIDFromToken || !phoneNumberFromToken) {
      return res.status(400).json({ message: "CustomerID or PhoneNumber is missing in the token." });
    }

    const decryptedPhone = decryptData(phoneNumberFromToken);
    console.log("🚀 ~ Decrypted Phone from Token:", decryptedPhone);

    const existingEmail = await CustomerEmail.findOne({
      where: { EmailId: decryptedEmail },
    });

    if (existingEmail) {
      console.log("🚀 ~ Email already exists.");
      return res.status(200).json({
        message: "Email already exists.",
        email: encryptData(decryptedEmail),
        phone: encryptData(decryptedPhone),
      });
    }

    const emailRecord = await CustomerEmail.create({
      CustomerID: customerIDFromToken,
      EmailId: decryptedEmail,
      IsDeleted: false,
    }).catch((err) => {
      console.error("Error creating email record:", err.message);
    });
    
    const phoneRecord = await CustomerMobile.create({
      CustomerID: customerIDFromToken,
      PhoneNumber: decryptedPhone,
      IsDeleted: false,
    }).catch((err) => {
      console.error("Error creating phone record:", err.message);
    });
    

    res.status(200).json({
      message: "Login successful",
      email: encryptData(decryptedEmail),
      phone: encryptData(decryptedPhone),
    });
  } catch (error) {
    console.error("🚀 ~ Error:", error.message);
    res.status(400).json({ message: "Error during processing", error: error.message });
  }
};

// Function to check if the data is encrypted
function isEncrypted(data) {
  return typeof data === "string" && data.startsWith("U2FsdGVkX1+");
}






module.exports = {createCustomer, loginCustomer};