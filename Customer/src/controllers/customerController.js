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
      PhoneNumber: Joi.string().pattern(/^\d+$/).required(),
      CustomerID: Joi.string().uuid().required()
    });

    const { EmailID, PhoneNumber, CustomerID } = await schema.validateAsync(req.body);

    let decryptedEmail = EmailID;
    let decryptedPhone = PhoneNumber;

    // Decrypt data if encrypted
    if (isEncrypted(EmailID)) {
      decryptedEmail = decryptData(EmailID);
    }
    if (isEncrypted(PhoneNumber)) {
      decryptedPhone = decryptData(PhoneNumber);
    }

    console.log("🚀 ~ Decrypted Email:", decryptedEmail);
    console.log("🚀 ~ Decrypted Phone:", decryptedPhone);

    const existingEmail = await CustomerEmail.findOne({
      where: { EmailId: decryptedEmail }
    });

    if (existingEmail) {
      console.log("🚀 ~ Email already exists.");
      return res.status(200).json({
        message: "Email already exists.",
        email: encryptData(decryptedEmail),
        phone: encryptData(decryptedPhone)
      });
    }

    const emailRecord = await CustomerEmail.create({
      CustomerID,
      EmailId: decryptedEmail,
      IsDeleted: false
    });

    const phoneRecord = await CustomerMobile.create({
      CustomerID,
      PhoneNumber: decryptedPhone,
      IsDeleted: false
    });

    res.status(200).json({
      message: "Login successful",
      email: encryptData(decryptedEmail),
      phone: encryptData(decryptedPhone)
    });

  } catch (error) {
    console.error("🚀 ~ Error:", error.message);
    res.status(400).json({ message: "Error during processing", error: error.message });
  }
};

// Function to check if the data is encrypted
function isEncrypted(data) {
  return typeof data === 'string' && data.startsWith('U2FsdGVkX1+');
}






module.exports = {createCustomer, loginCustomer};