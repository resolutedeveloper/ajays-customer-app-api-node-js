const jwt = require('jsonwebtoken');
const db = require('../models/index');
require('dotenv').config();

async function checKValidity(req, res, next) {
    next();
    // try {
    //     if (!req.headers.authorization) {
    //         return res.status(404).json({
    //             message: "token not found"
    //         })
    //     }
    //     else {
    //         const token = req.headers.authorization.split(" ")[1];
    //         // console.log(token);
    //         if (!token) {
    //             return res.status(404).json({
    //                 message: "Oops! There was an error while authentication! Login Again"
    //             })
    //         }
    //         else {

    //             try {
    //                 const verified = await jwt.verify(token, 'AjaysToken');
    //                 const FindUserDetails = await db.customer.findOne({ where: { CustomerID: verified.CustomerID } });
    //                 var UserIsActive = FindUserDetails.dataValues.IsActive;
    //                 var UserIsDeleted = FindUserDetails.dataValues.IsDeleted;

    //                 if (UserIsDeleted == true) {
    //                     return res.status(400).json({
    //                         account_status: "Acc_Deleted",
    //                         message: "Your account is deleted contact to admin"
    //                     })
    //                 }

    //                 if (UserIsActive == false) {
    //                     return res.status(400).json({
    //                         account_status: "Acc_Deactive",
    //                         message: "Your account is deactive contact to admin"
    //                     })
    //                 }

    //                 if (!verified) {
    //                     return res.status(404).json({
    //                         message: "Invalid token"
    //                     })
    //                 }
    //                 else {
    //                     verified.Password = undefined;
    //                     req.UserDetail = verified;
    //                     req.token = token;
    //                     next();
    //                 }
    //             } catch (error) {
    //                 return res.status(501).json({
    //                     message: "Invalid token"
    //                 })
    //             }
    //         }
    //     }
    // } catch (error) {
    //     console.log(error);
    //     return res.status(500).json({
    //         message: "Sorry! There was an server-side error"
    //     })
    // }
}

module.exports = checKValidity;