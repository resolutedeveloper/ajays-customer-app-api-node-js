const logger = require('../utils/logger');
const db = require("../models/index.js");
const moment = require('moment-timezone');

const AddOrder = async (req, res, io) => {
    const db_transaction = await db.sequelize.transaction(); // Start a transaction
    try {
        var {
            CompanyID,
            CustomerID,
            LocationID,
            Items,
            TotalTax,
            Total,
            DeviceType,
            DeviceModel,
            OSVersion,
            DeviceID,
            IPAddress,
            AppVersion
        } = req.body;


        const room = `location_room_${LocationID}`; // Generate the room name
        io.to(room).emit('OrderNotification', {
            success: true,
            message: 'New order created!',
            // orderId: newOrder.OrderID,
            locationId: LocationID,
        });

        return res.status(201).send({
            success: true,
            message: "Order created successfully!",
            // OrderID: newOrder.OrderID,
        });
        /*

        var new_items = [
            {
                "ItemID": 1,
                "CategoryID": 101,
                "CategoryName": "Beverages",
                "ItemName": "Coffee",
                "Description": "Premium quality coffee beans",
                "UnitRate": 150.00,
                "MRP": 175.00,
                "BigUnit": "Kilogram",
                "BigUnitValue": 1,
                "SmallUnit": "Gram",
                "SmallUnitValue": 1000,
                "OperationalUnit": "Packet",
                "OperationalUnitValue": 10,
                "CostingUnit": "Gram",
                "CostingUnitValue": 500,
                "SellingUnit": "Packet",
                "SellingUnitValue": 5,
                "ConversionRatio": 200,
                "RateWithoutTax": 100.00,
                "TaxForSale": 5,
                "IsVisible": true,
                "Image": "coffee.jpg",
                "Remarks": "Best Seller",
                "ItemOrder": 1
            },
            {
                "ItemID": 2,
                "CategoryID": 102,
                "CategoryName": "Snacks",
                "ItemName": "Chips",
                "Description": "Crunchy potato chips",
                "UnitRate": 50.00,
                "MRP": 60.00,
                "BigUnit": "Box",
                "BigUnitValue": 1,
                "SmallUnit": "Packet",
                "SmallUnitValue": 10,
                "OperationalUnit": "Carton",
                "OperationalUnitValue": 100,
                "CostingUnit": "Packet",
                "CostingUnitValue": 20,
                "SellingUnit": "Packet",
                "SellingUnitValue": 15,
                "ConversionRatio": 5,
                "RateWithoutTax": 100.00,
                "TaxForSale": 5,
                "IsVisible": true,
                "Image": "chips.jpg",
                "Remarks": "Limited Stock",
                "ItemOrder": 2
            },
            {
                "ItemID": 3,
                "CategoryID": 101,
                "CategoryName": "Beverages",
                "ItemName": "Tea",
                "Description": "Refreshing black tea leaves",
                "UnitRate": 120.00,
                "MRP": 140.00,
                "BigUnit": "Kilogram",
                "BigUnitValue": 1,
                "SmallUnit": "Gram",
                "SmallUnitValue": 1000,
                "OperationalUnit": "Packet",
                "OperationalUnitValue": 8,
                "CostingUnit": "Gram",
                "CostingUnitValue": 250,
                "SellingUnit": "Packet",
                "SellingUnitValue": 10,
                "ConversionRatio": 250,
                "RateWithoutTax": 100,
                "TaxForSale": 5,
                "IsVisible": true,
                "Image": "tea.jpg",
                "Remarks": "Popular Choice",
                "ItemOrder": 3
            },
            {
                "ItemID": 4,
                "CategoryID": 103,
                "CategoryName": "Dairy",
                "ItemName": "Milk",
                "Description": "Fresh and pure milk",
                "UnitRate": 25.00,
                "MRP": 30.00,
                "BigUnit": "Litre",
                "BigUnitValue": 1,
                "SmallUnit": "Millilitre",
                "SmallUnitValue": 1000,
                "OperationalUnit": "Bottle",
                "OperationalUnitValue": 6,
                "CostingUnit": "Millilitre",
                "CostingUnitValue": 500,
                "SellingUnit": "Bottle",
                "SellingUnitValue": 1,
                "ConversionRatio": 1000,
                "RateWithoutTax": 100,
                "TaxForSale": 5,
                "IsVisible": true,
                "Image": "milk.jpg",
                "Remarks": "Daily Essential",
                "ItemOrder": 4
            },
            {
                "ItemID": 5,
                "CategoryID": 104,
                "CategoryName": "Personal Care",
                "ItemName": "Soap",
                "Description": "Natural and herbal soap",
                "UnitRate": 40.00,
                "MRP": 50.00,
                "BigUnit": "Pack",
                "BigUnitValue": 1,
                "SmallUnit": "Bar",
                "SmallUnitValue": 6,
                "OperationalUnit": "Box",
                "OperationalUnitValue": 10,
                "CostingUnit": "Bar",
                "CostingUnitValue": 4,
                "SellingUnit": "Bar",
                "SellingUnitValue": 2,
                "ConversionRatio": 2,
                "RateWithoutTax": 100,
                "TaxForSale": 5,
                "IsVisible": true,
                "Image": "soap.jpg",
                "Remarks": "Skin Friendly",
                "ItemOrder": 5
            },
            {
                "ItemID": 6,
                "CategoryID": 105,
                "CategoryName": "Stationery",
                "ItemName": "Notebook",
                "Description": "A4 size ruled notebook",
                "UnitRate": 70.00,
                "MRP": 85.00,
                "BigUnit": "Dozen",
                "BigUnitValue": 1,
                "SmallUnit": "Piece",
                "SmallUnitValue": 12,
                "OperationalUnit": "Pack",
                "OperationalUnitValue": 4,
                "CostingUnit": "Piece",
                "CostingUnitValue": 3,
                "SellingUnit": "Piece",
                "SellingUnitValue": 2,
                "ConversionRatio": 6,
                "RateWithoutTax": 100,
                "TaxForSale": 5,
                "IsVisible": true,
                "Image": "notebook.jpg",
                "Remarks": "Student Favorite",
                "ItemOrder": 6
            },
            {
                "ItemID": 7,
                "CategoryID": 106,
                "CategoryName": "Electronics",
                "ItemName": "LED Bulb",
                "Description": "Energy-efficient LED bulb",
                "UnitRate": 200.00,
                "MRP": 250.00,
                "BigUnit": "Carton",
                "BigUnitValue": 1,
                "SmallUnit": "Piece",
                "SmallUnitValue": 20,
                "OperationalUnit": "Box",
                "OperationalUnitValue": 5,
                "CostingUnit": "Piece",
                "CostingUnitValue": 4,
                "SellingUnit": "Piece",
                "SellingUnitValue": 2,
                "ConversionRatio": 10,
                "RateWithoutTax": 100,
                "TaxForSale": 5,
                "IsVisible": true,
                "Image": "led_bulb.jpg",
                "Remarks": "Energy Saver",
                "ItemOrder": 7
            },
            {
                "ItemID": 8,
                "CategoryID": 107,
                "CategoryName": "Groceries",
                "ItemName": "Rice",
                "Description": "Long-grain basmati rice",
                "UnitRate": 80.00,
                "MRP": 100.00,
                "BigUnit": "Bag",
                "BigUnitValue": 1,
                "SmallUnit": "Kilogram",
                "SmallUnitValue": 20,
                "OperationalUnit": "Sack",
                "OperationalUnitValue": 10,
                "CostingUnit": "Kilogram",
                "CostingUnitValue": 5,
                "SellingUnit": "Kilogram",
                "SellingUnitValue": 2,
                "ConversionRatio": 4,
                "RateWithoutTax": 100,
                "TaxForSale": 5,
                "IsVisible": true,
                "Image": "rice.jpg",
                "Remarks": "High Demand",
                "ItemOrder": 8
            },
            {
                "ItemID": 9,
                "CategoryID": 108,
                "CategoryName": "Bakery",
                "ItemName": "Bread",
                "Description": "Freshly baked bread",
                "UnitRate": 30.00,
                "MRP": 35.00,
                "BigUnit": "Packet",
                "BigUnitValue": 1,
                "SmallUnit": "Slice",
                "SmallUnitValue": 10,
                "OperationalUnit": "Pack",
                "OperationalUnitValue": 20,
                "CostingUnit": "Slice",
                "CostingUnitValue": 5,
                "SellingUnit": "Packet",
                "SellingUnitValue": 2,
                "ConversionRatio": 5,
                "RateWithoutTax": 100,
                "TaxForSale": 5,
                "IsVisible": true,
                "Image": "bread.jpg",
                "Remarks": "Fresh Stock",
                "ItemOrder": 9
            },
            {
                "ItemID": 10,
                "CategoryID": 109,
                "CategoryName": "Frozen Foods",
                "ItemName": "Frozen Peas",
                "Description": "Fresh frozen peas",
                "UnitRate": 120.00,
                "MRP": 150.00,
                "BigUnit": "Packet",
                "BigUnitValue": 1,
                "SmallUnit": "Gram",
                "SmallUnitValue": 500,
                "OperationalUnit": "Box",
                "OperationalUnitValue": 10,
                "CostingUnit": "Gram",
                "CostingUnitValue": 250,
                "SellingUnit": "Packet",
                "SellingUnitValue": 5,
                "ConversionRatio": 50,
                "RateWithoutTax": 100,
                "TaxForSale": 5,
                "IsVisible": true,
                "Image": "frozen_peas.jpg",
                "Remarks": "Best Quality",
                "ItemOrder": 10
            }
        ];
        var new_tax = [
            { "ItemID": 1, "TaxID": 201, "TaxName": "CST", "TaxPercentage": 2.5 },
            { "ItemID": 1, "TaxID": 202, "TaxName": "SST", "TaxPercentage": 2.5 },
            { "ItemID": 2, "TaxID": 201, "TaxName": "CST", "TaxPercentage": 2.5 },
            { "ItemID": 2, "TaxID": 202, "TaxName": "SST", "TaxPercentage": 2.5 },
            { "ItemID": 3, "TaxID": 201, "TaxName": "CST", "TaxPercentage": 2.5 },
            { "ItemID": 3, "TaxID": 202, "TaxName": "SST", "TaxPercentage": 2.5 },
            { "ItemID": 4, "TaxID": 201, "TaxName": "CST", "TaxPercentage": 2.5 },
            { "ItemID": 4, "TaxID": 202, "TaxName": "SST", "TaxPercentage": 2.5 },
            { "ItemID": 5, "TaxID": 201, "TaxName": "CST", "TaxPercentage": 2.5 },
            { "ItemID": 5, "TaxID": 202, "TaxName": "SST", "TaxPercentage": 2.5 },
            { "ItemID": 6, "TaxID": 201, "TaxName": "CST", "TaxPercentage": 2.5 },
            { "ItemID": 6, "TaxID": 202, "TaxName": "SST", "TaxPercentage": 2.5 },
            { "ItemID": 7, "TaxID": 201, "TaxName": "CST", "TaxPercentage": 2.5 },
            { "ItemID": 7, "TaxID": 202, "TaxName": "SST", "TaxPercentage": 2.5 },
            { "ItemID": 8, "TaxID": 201, "TaxName": "CST", "TaxPercentage": 2.5 },
            { "ItemID": 8, "TaxID": 202, "TaxName": "SST", "TaxPercentage": 2.5 },
            { "ItemID": 9, "TaxID": 201, "TaxName": "CST", "TaxPercentage": 2.5 },
            { "ItemID": 9, "TaxID": 202, "TaxName": "SST", "TaxPercentage": 2.5 },
            { "ItemID": 10, "TaxID": 201, "TaxName": "CST", "TaxPercentage": 2.5 },
            { "ItemID": 10, "TaxID": 202, "TaxName": "SST", "TaxPercentage": 2.5 }
        ];

        // Calculate total and total tax
        Total = 0;
        TotalTax = 0;

        const orderDetails = Items.map((item) => {
            const itemDetails = new_items.find((i) => i.ItemID === item.ItemID);
            if (!itemDetails) {
                throw new Error(`ItemID ${item.ItemID} not found in new_items`);
            }

            const { RateWithoutTax, TaxForSale } = itemDetails;
            const itemTotal = RateWithoutTax * item.Qty;
            const itemTax = (itemTotal * TaxForSale) / 100;

            Total += itemTotal + itemTax;
            TotalTax += itemTax;

            return {
                ItemID: item.ItemID,
                Qty: item.Qty,
                Rate: RateWithoutTax,
                TotalAmount: itemTotal + itemTax,
                Tax: itemTax,
            };
        });

        const newOrder = await db.order.create(
            {

                CompanyID: CompanyID,
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
                NoOfItem: Items.length,
                PaymentInfo: '',
            },
            {
                transaction: db_transaction, // Use the transaction
            }
        );


        // Insert order details
        const orderDetailsEntries = new_items.map((detail) => {
            const item = Items.find((i) => i.ItemID === detail.ItemID);
            const qty = item ? item.Qty : 0;

            // Return the order details entry
            return {
                OrderID: newOrder.OrderID,
                ItemID: detail.ItemID,
                Qty: qty,
                CategoryID: detail.CategoryID,
                CategoryName: detail.CategoryName,
                ItemName: detail.ItemName,
                Description: detail.Description,
                UnitRate: detail.UnitRate,
                MRP: detail.MRP,
                BigUnit: detail.BigUnit,
                BigUnitValue: detail.BigUnitValue,
                SmallUnit: detail.SmallUnit,
                SmallUnitValue: detail.SmallUnitValue,
                OperationalUnit: detail.OperationalUnit,
                OperationalUnitValue: detail.OperationalUnitValue,
                CostingUnit: detail.CostingUnit,
                CostingUnitValue: detail.CostingUnitValue,
                SellingUnit: detail.SellingUnit,
                SellingUnitValue: detail.SellingUnitValue,
                ConversionRatio: detail.ConversionRatio,
                RateWithoutTax: detail.RateWithoutTax,
                TaxForSale: detail.TaxForSale,
                IsVisible: detail.IsVisible,
                Image: detail.ItemIImageD,
                Remarks: detail.Remarks,
                ItemOrder: detail.ItemOrder
            };
        });

        const createdOrderDetails = await db.orderDetails.bulkCreate(orderDetailsEntries, { transaction: db_transaction });

        // Insert order detail taxes
        const orderDetailTaxEntries = createdOrderDetails.flatMap((detail) => {
            const taxes = new_tax.filter((tax) => tax.ItemID === detail.ItemID);

            return taxes.map((tax) => ({
                ItemID: tax.ItemID,
                TaxID: tax.TaxID,
                TaxName: tax.TaxName,
                TaxPercentage: tax.TaxPercentage
            }));
        });

        await db.orderDetailsTax.bulkCreate(orderDetailTaxEntries, { transaction: db_transaction });

        await db_transaction.commit();


        // Room-specific notification broadcast
        const room = `location_room_${LocationID}`; // Generate the room name
        io.to(room).emit('OrderNotification', {
            success: true,
            message: 'New order created!',
            orderId: newOrder.OrderID,
            locationId: LocationID,
        });

        return res.status(201).send({
            success: true,
            message: "Order created successfully!",
            OrderID: newOrder.OrderID,
        });*/

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
