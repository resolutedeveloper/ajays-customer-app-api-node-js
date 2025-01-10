const logger = require('../utils/logger');
const db = require("../models/index.js");
const moment = require('moment-timezone');

const AddOrder = async (req, res) => {
    console.log(req.body)
    const db_transaction = await db.sequelize.transaction(); // Start a transaction
    try {
        const {
            CustomerID,
            LocationID,
            Iteams,
            TotalTax,
            Total,
            DeviceType,
            DeviceModel,
            OSVersion,
            DeviceID,
            IPAddress,
            AppVersion
        } = req.body;

        const newOrder = await db.order.create(
            {

                CustomerID: CustomerID,
                LocationID: LocationID,
                TotalTax: TotalTax,
                Total: Total,
                DeviceType: DeviceType,
                DeviceModel: DeviceModel,
                OSVersion: OSVersion,
                DeviceID: DeviceID,
                IPAddress: IPAddress,
                AppVersion: AppVersion,
                CreatedOn: new Date(),
                UpdatedOn: new Date(),
                NoOfItem: Iteams.length,
                PaymentInfo: '',
            },
            {
                transaction: db_transaction, // Use the transaction
            }
        );

        await db_transaction.commit();

        return res.status(201).send({
            success: true,
            message: "Order created successfully!",
            lastInsertId: newOrder.id,
        });

    } catch (error) {
        await db_transaction.rollback();
        return res.status(500).send({
            success: false,
            message: "Failed to create order!",
            error: error.message,
        });
    }




    // return res.status(201).send({ body: req.body });
};
module.exports = { AddOrder };
