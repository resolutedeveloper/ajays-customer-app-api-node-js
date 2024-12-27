const logger = require('../utils/logger');
const db = require("../models/index.js");
const CryptoJS = require('crypto-js');
const secretKey = process.env.CRYPTOJSKEY;

const name_update = async (req, res) => {
    try {
        const currentTimeUTC = new Date();
        const currentTimeIST = new Date(currentTimeUTC.getTime() + (5.5 * 60 * 60 * 1000));


        const NameUpdated = await db.customer.update({ 
            Name: req.body.Name,
            LastLogin:currentTimeIST,
            CreatedOn:currentTimeIST,
            LastModifiedOn:currentTimeIST
            }, { where: { 
                CustomerID: req.UserDetail.CustomerID 
            } 
        });
        logger.info(`User created: ${req.UserDetail.CustomerID} - ${req.body.Name}`);
        return res.status(200).json({ 
            message:'Customer name is updated.',
            data: NameUpdated,
        });
    } catch (error) {
        logger.error(`Error creating user: ${error.message}`); 
        res.status(400).json({ error: error.message,success: false, message: 'Error creating user' });
    }
};

const check_existing_customer = async (req, res) => {
    try {
        const FindCustomerExist = await db.customer.findOne({ where: { CustomerID: req.UserDetail.CustomerID } });
        if(FindCustomerExist.dataValues.Name){
            logger.info(`User created: ${req.UserDetail.CustomerID} - ${req.body.Name}`);
            return res.status(200).json({ 
                message:'customer already exists.'
            });
        }else{
            return res.status(400).json({ 
                message:"It's a new customer. Please update the customer name."
            });
        }
    } catch (error) {
        logger.error(`Error creating user: ${error.message}`); 
        res.status(400).json({ error: error.message,success: false, message: 'Error creating user' });
    }
};




const email_generate_otp = async (req, res) => {
    try {
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
        
                            
        // const currentTime = new Date();
        // const expirationTime = new Date(currentTime.getTime() + 5 * 60000); // 5 mi
        const currentTimeUTC = new Date();
        const currentTimeIST = new Date(currentTimeUTC.getTime() + (5.5 * 60 * 60 * 1000)); // Add 5 hours 30 minutes
        const expirationTimeIST = new Date(currentTimeIST.getTime() + 5 * 60000); 
    
        const DecryptedMobileNumber = await db.emailVerificationOTP.create({
            CustomerID: req.UserDetail.CustomerID, 
            EmailID: req.body.EmailID, 
            OTP: generateOTP(),
            IsStatus: 0,
            CreatedOn: currentTimeIST,
            UsedOn : '',
            ExpiredOn: expirationTimeIST,
            IsDeleted:0
        });
        

        return res.status(200).json({
            message: 'Email Verification OTP..',
            OTPDetail: DecryptedMobileNumber.dataValues.OTP
        });
    } catch (error) {
        logger.error(`Error email: ${error.message}`); 
        res.status(400).json({ error: error.message,success: false, message: 'Error email' });
    }
};


const email_otp_verification = async (req, res) => {
    try {
        const FindCustomer = await db.customer.findOne({ where: { CustomerID: req.UserDetail.CustomerID } });
        const DecryptEmail = (encryptedField, secretKey) => {
            const bytes = CryptoJS.AES.decrypt(encryptedField, secretKey);
            return bytes.toString(CryptoJS.enc.Utf8);
        };
        var DecryptedEmailID = DecryptEmail(req.body.EmailID, secretKey);
        if (FindCustomer) {
            if (FindCustomer.IsActive) {
                const CustomerUsedOTP = await db.emailVerificationOTP.findOne({ where: { OTP: req.body.OTP, IsStatus: '1' } });
                if (CustomerUsedOTP) {
                    return res.json( {ErrorCode: "VALIDATION", ErrorMessage: 'This OTP is already used..' });
                }
                const CustomerOTPVarification = await db.emailVerificationOTP.findOne({ where: { OTP: req.body.OTP, IsStatus: '0' } });
                if (CustomerOTPVarification) {
                    const existingRecord = await db.customerEmail.findOne({
                        where: {
                            CustomerID: req.UserDetail.CustomerID
                        },
                    });
                    
                    if (existingRecord) {
                       
                        await db.customerEmail.update({ 
                            EmailID: DecryptedEmailID }, { where: { 
                                CustomerID: req.UserDetail.CustomerID }
                            });

                        
                    } else {
                        await db.customerEmail.create({
                            CustomerID: req.UserDetail.CustomerID,
                            EmailID: DecryptedEmailID,
                            IsDeleted: 0,
                        });
                        
                    }

                    // const currentTime = new Date();
                    // const expirationTime = new Date(currentTime.getTime() + 5 * 60000); // 5 mi
                    const currentTimeUTC = new Date();
                    const currentTimeIST = new Date(currentTimeUTC.getTime() + (5.5 * 60 * 60 * 1000)); // Add 5 hours 30 minutes
                    const expirationTimeIST = new Date(currentTimeIST.getTime() + 5 * 60000); 

                    db.customer.update({ EmailID: req.body.EmailID }, { where: { CustomerID: req.UserDetail.CustomerID } });
                    db.emailVerificationOTP.update({ IsStatus: true, UsedOn: expirationTimeIST}, { where: { CustomerID: req.UserDetail.CustomerID } });
                    
                    return res.status(200).json({ 
                        message: 'Email Is updated successfully'
                    });   
                } else {
                    return res.status(400).json({ErrorCode: "VALIDATION", ErrorMessage: 'Invalid OTP..' });
                }
            } else {
                return res.status(400).send( {ErrorCode: "VALIDATION", ErrorMessage: 'Your Account Is Deactive..' });
            }
        } else {
            return res.status(400).send({ErrorCode: "VALIDATION", ErrorMessage: 'Invalid Customer ID or Mobile Number..' });
        }
    } catch (error) {
        logger.error(`Error email: ${error.message}`); 
        res.status(400).json({ error: error.message,success: false, message: 'Error email' });
    }
};




const mobile_generate_otp = async (req, res) => {
    try {
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
        
                            
        // const currentTime = new Date();
        // const expirationTime = new Date(currentTime.getTime() + 5 * 60000); // 5 mi
        const currentTimeUTC = new Date();
        const currentTimeIST = new Date(currentTimeUTC.getTime() + (5.5 * 60 * 60 * 1000)); // Add 5 hours 30 minutes
        const expirationTimeIST = new Date(currentTimeIST.getTime() + 5 * 60000); 
    
        const DecryptedMobileNumber = await db.mobileVerificationOTP.create({
            CustomerID: req.UserDetail.CustomerID, 
            PhoneNumber: req.body.PhoneNumber, 
            OTP: generateOTP(),
            IsStatus: 0,
            CreatedOn: currentTimeIST,
            UsedOn : '',
            ExpiredOn: expirationTimeIST
        });
        

        return res.status(200).json({
            message: 'Mobile Verification OTP..',
            OTPDetail: DecryptedMobileNumber.dataValues.OTP
        });
    } catch (error) {
        logger.error(`Error email: ${error.message}`); 
        res.status(400).json({ error: error.message,success: false, message: 'Error email' });
    }
};

const mobile_otp_verification = async (req, res) => {
    try {
        const FindCustomer = await db.customer.findOne({ where: { CustomerID: req.UserDetail.CustomerID } });
        const DecryptMobile = (encryptedField, secretKey) => {
            const bytes = CryptoJS.AES.decrypt(encryptedField, secretKey);
            return bytes.toString(CryptoJS.enc.Utf8);
        };
        var DecryptedMobile = DecryptMobile(req.body.PhoneNumber, secretKey);
        if (FindCustomer) {
            if (FindCustomer.IsActive) {
                const CustomerUsedOTP = await db.mobileVerificationOTP.findOne({ where: { OTP: req.body.OTP, IsStatus: '1' } });
                if (CustomerUsedOTP) {
                    return res.json( {ErrorCode: "VALIDATION", ErrorMessage: 'This OTP is already used..' });
                }
                const CustomerOTPVarification = await db.mobileVerificationOTP.findOne({ where: { OTP: req.body.OTP, IsStatus: '0' } });
                if (CustomerOTPVarification) {
                    const existingRecord = await db.customerMobile.findOne({
                        where: {
                            CustomerID: req.UserDetail.CustomerID
                        },
                    });
                    
                    if (existingRecord) {
                       
                        await db.customerMobile.update({ 
                            EmailID: DecryptedMobile }, { where: { 
                                CustomerID: req.UserDetail.CustomerID }
                            });

                        
                    } else {
                        await db.customerMobile.create({
                            CustomerID: req.UserDetail.CustomerID,
                            EmailID: DecryptedMobile,
                            IsDeleted: 0,
                        });
                        
                    }

                    // const currentTime = new Date();
                    // const expirationTime = new Date(currentTime.getTime() + 5 * 60000); // 5 mi
                    const currentTimeUTC = new Date();
                    const currentTimeIST = new Date(currentTimeUTC.getTime() + (5.5 * 60 * 60 * 1000)); // Add 5 hours 30 minutes
                    const expirationTimeIST = new Date(currentTimeIST.getTime() + 5 * 60000); 

                    db.customer.update({ PhoneNumber: req.body.PhoneNumber }, { where: { CustomerID: req.UserDetail.CustomerID } });
                    db.mobileVerificationOTP.update({ IsStatus: true, UsedOn: expirationTimeIST}, { where: { CustomerID: req.UserDetail.CustomerID } });
                    
                    return res.status(200).json({ 
                        message: 'Mobile Is updated successfully'
                    });   
                } else {
                    return res.status(400).json({ErrorCode: "VALIDATION", ErrorMessage: 'Invalid OTP..' });
                }
            } else {
                return res.status(400).send( {ErrorCode: "VALIDATION", ErrorMessage: 'Your Account Is Deactive..' });
            }
        } else {
            return res.status(400).send({ErrorCode: "VALIDATION", ErrorMessage: 'Invalid Customer ID or Mobile Number..' });
        }
    } catch (error) {
        logger.error(`Error mobile: ${error.message}`); 
        res.status(400).json({ error: error.message,success: false, message: 'Error mobile' });
    }
};
module.exports = { name_update, check_existing_customer, email_generate_otp, email_otp_verification, mobile_generate_otp,mobile_otp_verification};