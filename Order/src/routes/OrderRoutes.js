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
        Items: Joi.array()
            .items(
                Joi.object({
                    ItemID: Joi.number().integer().required(),
                    Qty: Joi.number().integer().min(1).required(),
                })
            )
            .min(1)
            .required(),
        TotalTax: Joi.number().positive().optional(),
        Total: Joi.number().positive().required(),
        DeviceType: Joi.string().required(),
        DeviceModel: Joi.string().required(),
        OSVersion: Joi.string().required(),
        DeviceID: Joi.string().required(),
        IPAddress: Joi.string().ip({ version: ['ipv4', 'ipv6'] }).required(),
        AppVersion: Joi.string().required(),
        Version: Joi.string().max(20).required(),
    });

    validateRequest(req, res, next, schema);
};

// router.post("/", AddOrderRequest, AddOrder);
router.post("/", AddOrderRequest, (req, res) => {
    const io = req.io;  // Retrieve the io instance
    AddOrder(req, res, io);  // Pass io instance to AddOrder controller
});

router.get("/list", getOrderListUser);
router.get("/detail", getOrderDetail);


module.exports = router;