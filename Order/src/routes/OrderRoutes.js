const express = require('express');
const router = express.Router();

const { AddOrder, getOrderListUser, getOrderDetail } = require('../controllers/OrderController');
const { validateRequest } = require('../config/validate-request');
const Joi = require('joi');


const AddOrderRequest = (req, res, next) => {
    const schema = Joi.object({
        CustomerID: Joi.string().required(),
        CompanyID: Joi.number().integer().required(),
        LocationID: Joi.number().integer().required(),
        OrderMode: Joi.string().valid('ONLINE TAKE-AWAY', 'ONLINE PRE-ORDER').required(),
        Items: Joi.array()
            .items(
                Joi.object({
                    ItemID: Joi.number().integer().required(),
                    Qty: Joi.number().integer().min(1).required(),
                    Remark: Joi.string().trim().allow("").optional()
                })
            )
            .min(1)
            .required(),
        TotalTax: Joi.number().min(0).precision(2).optional(),
        Total: Joi.number().positive().required(),
        DeviceType: Joi.string().optional(),
        DeviceModel: Joi.string().optional(),
        OSVersion: Joi.string().optional(),
        DeviceID: Joi.string().optional(),
        IPAddress: Joi.string().ip({ version: ['ipv4', 'ipv6'] }).allow(null, "").optional(),
        AppVersion: Joi.string().optional(),
        Version: Joi.string().max(20).optional(),
    });

    validateRequest(req, res, next, schema);
};

// router.post("/", AddOrderRequest, AddOrder);
router.post("/", AddOrderRequest, AddOrder);

router.get("/list", getOrderListUser);
router.get("/detail", getOrderDetail);


module.exports = router;