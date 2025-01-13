const logger = require('../utils/logger');
const db = require("../models/index.js");
const moment = require('moment-timezone');
const { encryption, decryption } = require("../helpers/services");
const jwt = require("jsonwebtoken");
const { generateOTP } = require("../middelware/Otp.js");
require("dotenv").config();

const MobileNumberVerification = async (req, res) => {
    try {
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
        var DecryptedMobile = decryption(req.body.PhoneNumber);
        if (!DecryptedMobile) {
            return res.status(400).json({
                message: "Error while decrypting"
            });
        }

        //Blank or in valid mobile number check validation
        const regex = /^[6-9]\d{9}$/;

        if (!regex.test(DecryptedMobile)) {
            return res.status(400).send({ ErrorCode: "VALIDATION", Message: 'Invalid mobile number' });
        }

        const CurrentDateTime = moment.tz(new Date(), "Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss');

        const OTPVerificationAddedTime = moment.tz(CurrentDateTime, "Asia/Kolkata").add(process.env.OTPEXTRATIME, 'minutes').format('YYYY-MM-DD HH:mm:ss');


        const findcustomer = await db.customerMobile.findOne({ where: { PhoneNumber: DecryptedMobile } });
        if (!findcustomer) {
            const NewCustomerCreate = await db.customer.create({
                PhoneNumber: req.body.PhoneNumber,
                LastLogin: CurrentDateTime,
                CreatedOn: CurrentDateTime,
                LastModifiedOn: CurrentDateTime,
                CreatedBy: 'null',
                LastModifiedBy: 'null',
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
                IsActive: 1,
                IsDeleted: 0
            });

            await db.customerMobile.create({
                CustomerID: NewCustomerCreate.CustomerID,
                PhoneNumber: DecryptedMobile,
                IsDeleted: 0
            });

            const CustomerDecDetails = await db.customerMobile.findOne({ where: { PhoneNumber: DecryptedMobile } });
            if (!CustomerDecDetails) {
                return res.status(400).send({
                    ErrorCode: "VALIDATION",
                    ErrorMessage: 'Mobile number is not exist..'
                });
            }
            const FindCustomer = await db.customer.findOne({
                where: { CustomerID: CustomerDecDetails.dataValues.CustomerID }
            });

            if (FindCustomer.dataValues.IsDeleted == 1) {
                return res.status(400).send({
                    ErrorCode: "VALIDATION",
                    Message: 'Your account is deleted. please contact to admin..'
                });
            }

            if (FindCustomer.dataValues.IsActive == 0) {
                return res.status(400).send({ ErrorCode: "VALIDATION", Message: 'Your account is deactivated. please contact to admin..' });
            }


            if (FindCustomer) {
                if (FindCustomer.IsActive == true) {
<<<<<<< Updated upstream
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


=======
                    
>>>>>>> Stashed changes
                    db.mobileVerificationOTP.update({
                        IsStatus: true,
                        ExpiredOn: CurrentDateTime
                    }, {
                        where: {
                            CustomerID: FindCustomer.CustomerID
                        }
                    });

                    const otptable = await db.mobileVerificationOTP.create({
                        CustomerID: FindCustomer.CustomerID,
                        PhoneNumber: FindCustomer.PhoneNumber,
                        OTP: generateOTP(),
                        CreatedOn: OTPVerificationAddedTime,
                        ExpiredOn: OTPVerificationAddedTime,
                        UsedOn: CurrentDateTime,
                        IsStatus: 0,
                        IsDeleted: 0
                    });

                    return res.status(200).json({
                        message: 'Customer OTP..',
                        OTPDetail: otptable.dataValues.OTP
                    });

                } else {

                    return res.status(400).send({ ErrorCode: "VALIDATION", Message: 'Your account is deactivated. please contact to admin..' });
                }
            } else {
                return res.status(400).send({ ErrorCode: "VALIDATION", Message: 'Mobile Number is not registeted. Please enter a valid registered Mobile Number..' });
            }
        } else {
            const CustomerDecDetails = await db.customerMobile.findOne({ where: { PhoneNumber: DecryptedMobile } });
            if (!CustomerDecDetails) {
                return res.status(400).send({
                    ErrorCode: "VALIDATION",
                    Message: 'Mobile number is not exist..'
                });
            }
            const FindCustomer = await db.customer.findOne({
                where: { CustomerID: CustomerDecDetails.dataValues.CustomerID }
            });

            if (FindCustomer.dataValues.IsDeleted == 1) {
                return res.status(400).send({
                    ErrorCode: "VALIDATION",
                    Message: 'Your account is deleted. please contact to admin..'
                });
            }

            if (FindCustomer.dataValues.IsActive == 0) {
                return res.status(400).send({ ErrorCode: "VALIDATION", Message: 'Your account is deactivated. please contact to admin..' });
            }


            if (FindCustomer) {
                if (FindCustomer.IsActive == true) {
<<<<<<< Updated upstream
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
=======
            
>>>>>>> Stashed changes
                    db.mobileVerificationOTP.update({
                        IsStatus: true,
                        ExpiredOn: CurrentDateTime
                    }, {
                        where: {
                            CustomerID: FindCustomer.CustomerID
                        }
                    });

                    const otptable = await db.mobileVerificationOTP.create({
                        CustomerID: FindCustomer.CustomerID,
                        PhoneNumber: FindCustomer.PhoneNumber,
                        OTP: generateOTP(),
                        CreatedOn: OTPVerificationAddedTime,
                        ExpiredOn: OTPVerificationAddedTime,
                        UsedOn: CurrentDateTime,
                        IsStatus: 0,
                        IsDeleted: 0
                    });

                    return res.status(200).json({
                        message: 'Customer OTP..',
                        OTPDetail: otptable.dataValues.OTP
                    });

                } else {

                    return res.status(400).send({ ErrorCode: "VALIDATION", Message: 'Your account is deactivated. please contact to admin..' });
                }
            } else {
                return res.status(400).send({ ErrorCode: "VALIDATION", Message: 'Mobile Number is not registeted. Please enter a valid registered Mobile Number..' });
            }
        }

    } catch (err) {
        logger.error(`Error creating Company: ${err.message}`);  // Log errors
        res.status(500).send({ success: false, message: 'Error creating Company' });
    }
};

const OTPverification = async (req, res) => {
    try {
        var DecryptedMobile = decryption(req.body.PhoneNumber);
        if (!DecryptedMobile) {
            return res.status(400).json({
                message: "Error while decrypting"
            });
        }
        //Blank or in valid mobile number check validation
        const regex = /^[6-9]\d{9}$/;
        if (!regex.test(DecryptedMobile)) {
            return res.status(400).send({ ErrorCode: "VALIDATION", Message: 'Invalid mobile number' });
        }

        const CustomerDecDetails = await db.customerMobile.findOne({ where: { PhoneNumber: DecryptedMobile } });

        if (!CustomerDecDetails) {
            return res.status(400).json({ ErrorCode: "VALIDATION", Message: 'Invalid mobile number..' });
        }

        const FindCustomer = await db.customer.findOne({ where: { CustomerID: CustomerDecDetails.dataValues.CustomerID } });

        if (FindCustomer) {
            if (FindCustomer.IsActive) {
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
                const CustomerUsedOTP = await db.mobileVerificationOTP.findOne({ where: { CustomerID: CustomerDecDetails.dataValues.CustomerID, OTP: req.body.OTP, IsStatus: '1' } });
                if (CustomerUsedOTP) {
                    return res.json({ ErrorCode: "VALIDATION", Message: 'This OTP is already used..' });
                }
                const CustomerOTPVarification = await db.mobileVerificationOTP.findOne({ where: { OTP: req.body.OTP, IsStatus: 0, CustomerID: CustomerDecDetails.dataValues.CustomerID } });
                if (CustomerOTPVarification) {
                    //Time Out OTP
                    var CurrentDateTime = new Date(moment.tz(new Date(), "Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss'));
                    var OTPDateTime = new Date(CustomerOTPVarification.dataValues.CreatedOn); // Convert to Date object

                    //return res.json(CurrentDateTime +' ---- '+ OTPDateTime);
                    if (CurrentDateTime > OTPDateTime) {
                        return res.status(400).send({ ErrorCode: "OTPTIME", Message: 'OTP time out..' });
                    }

<<<<<<< Updated upstream
                    const token = jwt.sign(FindCustomer.toJSON(), LoginToken, { expiresIn: "7d" });
                    if (token) {
                        db.mobileVerificationOTP.update({ IsStatus: true }, { where: { CustomerID: FindCustomer.CustomerID } });
=======
                    const token = jwt.sign(FindCustomer.toJSON(), process.env.JWT_SECRET, { expiresIn: "2592000s" });
                    if (token) {
                        await db.mobileVerificationOTP.update({ IsStatus: true }, { where: { CustomerID: FindCustomer.CustomerID } });
>>>>>>> Stashed changes
                        return res.status(200).json({
                            data: FindCustomer,
                            token: token
                        });
                    } else {
                        return res.status(400).json({ ErrorCode: "VALIDATION", Message: 'Token generation failed..' });
                    }
                } else {
                    return res.status(400).json({ ErrorCode: "VALIDATION", Message: 'Invalid OTP..' });
                }
            } else {
                return res.status(400).send({ ErrorCode: "VALIDATION", Message: 'Your Account Is Deactive..' });
            }
        } else {
            return res.status(400).send({ ErrorCode: "VALIDATION", Message: 'Invalid OTP..' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { MobileNumberVerification, OTPverification };
