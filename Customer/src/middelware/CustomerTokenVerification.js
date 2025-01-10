const jwt = require('jsonwebtoken');
const db = require('../models/index');
require('dotenv').config();

async function checKValidity(req, res, next) {
    try {
        if (!req.headers.authorization) {
            return res.status(404).json({
                message: "token not found"
            })
        }
        else {
            const token = req.headers.authorization.split(" ")[1];
        
            if (!token) {
                return res.status(404).json({
                    message: "Oops! There was an error while authentication! Login Again"
                })
            }
            else {
                try {
                    const verified = jwt.verify(token, process.env.JWT_SECRET);

                    if (!verified) {
                        return res.status(404).json({
                            message: "Invalid token"
                        })
                    }
                    else {
                        const FindUserDetails = await db.customer.findOne({ where: { CustomerID: verified.CustomerID } });
                        const UserIsActive = FindUserDetails?.dataValues?.IsActive;
                        const UserIsDeleted = FindUserDetails?.dataValues?.IsDeleted;
                        if (UserIsDeleted == true) {
                            return res.status(400).json({
                                account_status: "Acc_Deleted",
                                message: "Your account is deleted contact to admin"
                            })
                        }
                        else if (UserIsActive == false) {
                            return res.status(400).json({
                                account_status: "Acc_Deactive",
                                message: "Your account is deactive contact to admin"
                            })
                        }
                        else {
                            verified.Password = undefined;
                            req.UserDetail = verified;
                            // req.token = token;
                            next();
                        }
                    }
                } catch (error) {
                    return res.status(501).json({
                        message: "Invalid token"
                    })
                }
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Sorry! There was an server-side error"
        })
    }
}

module.exports = checKValidity;