const logger = require('../utils/logger');
const db = require("../models/index.js");
const moment = require('moment-timezone');
const LoginToken = "AjaysToken";
const CryptoJS = require('crypto-js');
const secretKey = process.env.CRYPTOJSKEY;
const jwt = require("jsonwebtoken");

const MobileNumberVerification = async (req, res) => {
    try {
        const DecryptMobileNumber = (encryptedField, secretKey) => {
            const bytes = CryptoJS.AES.decrypt(encryptedField, secretKey);
            return bytes.toString(CryptoJS.enc.Utf8);
        };
        var DecryptedMobile = DecryptMobileNumber(req.body.PhoneNumber, secretKey);
        const CurrentDateTime = moment.tz(new Date(), "Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss');

        const OTPVerificationAddedTime = moment.tz(CurrentDateTime, "Asia/Kolkata").add(process.env.OTPEXTRATIME, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        

        const findcustomer = await db.customerMobile.findOne({ where: { PhoneNumber: DecryptedMobile } });
        if(!findcustomer){
            const NewCustomerCreate = await db.customer.create({
                PhoneNumber:req.body.PhoneNumber,
                LastLogin: '',
                CreatedOn:CurrentDateTime,
                LastModifiedOn:'',
                CreatedBy:'',
                LastModifiedBy:'',
                IsActive:1,
                IsDeleted:0
            });

            await db.customerMobile.create({
                CustomerID: NewCustomerCreate.CustomerID, 
                PhoneNumber: DecryptedMobile, 
                IsDeleted:0
            });

            const CustomerDecDetails = await db.customerMobile.findOne({ where: { PhoneNumber: DecryptedMobile } });
            if(!CustomerDecDetails){
                return res.status(400).send({   
                    ErrorCode: "VALIDATION", 
                    ErrorMessage: 'Mobile number is not exist..' 
                });
            }
            const FindCustomer = await db.customer.findOne({ 
                where: { CustomerID: CustomerDecDetails.dataValues.CustomerID } 
            });

            if(FindCustomer.dataValues.IsDeleted == 1){
                return res.status(400).send({
                    ErrorCode: "VALIDATION", 
                    ErrorMessage: 'Your account is deleted. please contact to admin..' 
                });
            }

            if(FindCustomer.dataValues.IsActive == 0){
                return res.status(400).send({ErrorCode: "VALIDATION", ErrorMessage: 'Your account is deactivated. please contact to admin..' });
            }


            if (FindCustomer) {
                if (FindCustomer.IsActive == true) {
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
                    

                    db.mobileVerificationOTP.update({ 
                        IsStatus: true,
                        ExpiredOn: CurrentDateTime},{ 
                        where: { 
                        CustomerID: FindCustomer.CustomerID 
                    }});


                    const otptable = await db.mobileVerificationOTP.create({
                        CustomerID: FindCustomer.CustomerID, 
                        PhoneNumber: FindCustomer.PhoneNumber, 
                        OTP: generateOTP(),
                        CreatedOn: currentTimeIST,
                        ExpiredOn: expirationTimeIST,

                        CreatedOn: OTPVerificationAddedTime,
                        ExpiredOn: '',

                        UsedOn:'',
                        IsStatus:0,
                        IsDeleted:0
                    });

                return res.status(200).json({
                    message: 'Customer OTP..',
                    OTPDetail: otptable.dataValues.OTP
                });

            } else {
                
                return res.status(400).send({ErrorCode: "VALIDATION", ErrorMessage: 'Your account is deactivated. please contact to admin..' });
            }
            } else {
                return res.status(400).send({ErrorCode: "VALIDATION", ErrorMessage: 'Mobile Number is not registeted. Please enter a valid registered Mobile Number..' });
            }
        }else{
            const CustomerDecDetails = await db.customerMobile.findOne({ where: { PhoneNumber: DecryptedMobile } });
                if(!CustomerDecDetails){
                    return res.status(400).send({   
                        ErrorCode: "VALIDATION", 
                        ErrorMessage: 'Mobile number is not exist..' 
                    });
                }
                const FindCustomer = await db.customer.findOne({ 
                    where: { CustomerID: CustomerDecDetails.dataValues.CustomerID } 
                });

                if(FindCustomer.dataValues.IsDeleted == 1){
                    return res.status(400).send({
                        ErrorCode: "VALIDATION", 
                        ErrorMessage: 'Your account is deleted. please contact to admin..' 
                    });
                }

                if(FindCustomer.dataValues.IsActive == 0){
                    return res.status(400).send({ErrorCode: "VALIDATION", ErrorMessage: 'Your account is deactivated. please contact to admin..' });
                }


                if (FindCustomer) {
                    if (FindCustomer.IsActive == true) {
                        function generateOTP() {
                            const length = process.env.OTPDIGITS; // Length of the OTP
                            const characters = '0123456789'; // Characters to use for generating the OTP
                            let otp = '';
                            for (let i = 0; i < length; i++) {
                                const randomIndex = Math.floor(Math.random() * characters.length);
                                otp += characters[randomIndex];
                            }
                            return otp;
                            //return 123456;
                        }

                        

                        // const currentTime = new Date();
                        // const expirationTime = new Date(currentTime.getTime() + 5 * 60000); // 5 mi
                        const currentTimeUTC = new Date();
                        const currentTimeIST = new Date(currentTimeUTC.getTime() + (5.5 * 60 * 60 * 1000)); // Add 5 hours 30 minutes
                        const expirationTimeIST = new Date(currentTimeIST.getTime() + 5 * 60000); 

                        
                        
                        db.mobileVerificationOTP.update({ 
                            IsStatus: true,
                            ExpiredOn: CurrentDateTime},{ 
                            where: { 
                            CustomerID: FindCustomer.CustomerID 
                        }});

                        const otptable = await db.mobileVerificationOTP.create({
                            CustomerID: FindCustomer.CustomerID, 
                            PhoneNumber: FindCustomer.PhoneNumber, 
                            OTP: generateOTP(),
                            CreatedOn: currentTimeIST,
                            ExpiredOn: expirationTimeIST,

                            CreatedOn: OTPVerificationAddedTime,
                            ExpiredOn: '',
                            UsedOn:'',
                            IsStatus:0,
                            IsDeleted:0
                        });

                    return res.status(200).json({
                        message: 'Customer OTP..',
                        OTPDetail: otptable.dataValues.OTP
                    });

                } else {
                    
                    return res.status(400).send({ErrorCode: "VALIDATION", ErrorMessage: 'Your account is deactivated. please contact to admin..' });
                }
                } else {
                return res.status(400).send({ErrorCode: "VALIDATION", ErrorMessage: 'Mobile Number is not registeted. Please enter a valid registered Mobile Number..' });
            }
        }

    } catch (err) {
        logger.error(`Error creating Company: ${err.message}`);  // Log errors
        res.status(500).send({ success: false, message: 'Error creating Company' });
    }
};


const OTPverification = async (req, res) => {
    const DecryptMobileNumber = (encryptedField, secretKey) => {
        const bytes = CryptoJS.AES.decrypt(encryptedField, secretKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    };
    var DecryptedMobile = DecryptMobileNumber(req.body.PhoneNumber, secretKey);
    try {
        const data = req.body;
        const CustomerDecDetails = await db.customerMobile.findOne({ where: { PhoneNumber: DecryptedMobile } });
        
        if(!CustomerDecDetails){
            return res.status(400).json({ErrorCode: "VALIDATION", ErrorMessage: 'Invalid mobile number..' });
        }
        
        const FindCustomer = await db.customer.findOne({ where: { CustomerID: CustomerDecDetails.dataValues.CustomerID } });

        if (FindCustomer) {
            if (FindCustomer.IsActive) {

                const CustomerUsedOTP = await db.mobileVerificationOTP.findOne({ where: { OTP: data.OTP, IsStatus: '1' } });
                if (CustomerUsedOTP) {
                    return res.json( {ErrorCode: "VALIDATION", ErrorMessage: 'This OTP is already used..' });
                }
                const CustomerOTPVarification = await db.mobileVerificationOTP.findOne({ where: { OTP: data.OTP, IsStatus: '0' } });

                
                
                if (CustomerOTPVarification) {
                    //Time Out OTP
                    const { Sequelize } = require('sequelize');
                    const currentDateTime = Sequelize.fn('DATE_FORMAT', Sequelize.fn('NOW'), '%Y-%m-%d %H:%i:%s');
                    const DatabaseCurrentTime = await db.mobileVerificationOTP.findOne({attributes: [[currentDateTime, 'currentDateTime']]});
                    
                    var CurrentDBDateTime = new Date(DatabaseCurrentTime.dataValues.currentDateTime); // Convert to Date object
                    var OTPDateTime = new Date(CustomerOTPVarification.dataValues.CreatedOn); // Convert to Date object
                    
                    if (CurrentDBDateTime > OTPDateTime) {
                        return res.status(400).send({ ErrorCode: "OTPTIME", ErrorMessage: 'OTP time out..' });
                    }


                    const token = jwt.sign(FindCustomer.toJSON(), LoginToken, { expiresIn: "2592000s" });
                    if (token) {
                        db.mobileVerificationOTP.update({ IsStatus: true }, { where: { CustomerID: FindCustomer.CustomerID } });
                        return res.status(200).json({ 
                            data: FindCustomer, 
                            token: token
                        });    
                    } else {
                        return res.status(400).json( {ErrorCode: "VALIDATION", ErrorMessage: 'Token generation failed..' });
                    }
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
        res.status(400).json({ error: error.message });
    }
}

module.exports = { MobileNumberVerification, OTPverification};