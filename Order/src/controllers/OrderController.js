const logger = require('../utils/logger');
const db = require("../models/index.js");
const moment = require('moment-timezone');
const axios = require('axios');

const AddOrder = async (req, res, io) => {
    try {
        const db_transaction = await db.sequelize.transaction(); // Start a transaction
        var {
            CompanyID,
            CustomerID,
            LocationID,
            OrderMode,
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

        const axiosData = await axios.post(`${process?.env?.CATALOG_LOCAL_URL}/httpResponse/checkoutItemsData`, {
            Items: Items,
            CompanyID: CompanyID,
            LocationID: LocationID
        }, {
            headers: { "Authorization": "Bearer " + process?.env?.HTTP_REQUEST_SECRET_KEY }
        });

        if (axiosData?.status !== 200 || !axiosData?.data?.data) {
            return res.status(axiosData?.status || 500).json({
                message: "Failed to fetch data"
            });
        }

        var http_item_data = axiosData?.data?.data;

        if (http_item_data[0]?.SUCCESS == 0) {
            return res.status(400).json({
                message: "Outlets currently offline",

            });
        }

        var new_items = http_item_data[1];
        var new_tax = http_item_data[2];

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
                OrderMode: OrderMode,
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
                OrderID: newOrder.OrderID,
                ItemID: tax.ItemID,
                TaxID: tax.TaxID,
                TaxName: tax.TaxName,
                Percentage: tax.Percentage
            }));
        });


        await db.orderDetailsTax.bulkCreate(orderDetailTaxEntries, { transaction: db_transaction });

        await db_transaction.commit();

        /*
        var socket_order = await db.order.findAll({
            where: {
                OrderID: newOrder.OrderID,
            },
        });

        var socket_items = await db.orderDetails.findAll({
            where: {
                OrderID: newOrder.OrderID,
            },
        });
        var socket_taxs = await db.orderDetails.findAll({
            where: {
                OrderID: newOrder.OrderID,
            },
        });
        var payment_info = [];

        const room = `location_room_${LocationID}`; // Generate the room name
        io.to(room).emit('NewOrder', {
            success: true,
            message: 'New order created!',
            order: socket_order,
            items: socket_items,
            taxs: socket_taxs,
            payment_info: payment_info
        });*/

        return res.status(201).send({
            success: true,
            message: "Order created successfully!",
            OrderID: newOrder.OrderID,
        });

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Failed to create order!",
            error: error.message,
        });
    }
};


const OrderApprove = async (req) => {
    try {
        req = req.message;

        const db_transaction = await db.sequelize.transaction();
        const OrderList = await db.order.findOne({
            where: {
                OrderID: req.OrderID,
                LocationID: req.LocationID,
            },
        });
        if (OrderList) {
            if (OrderList.dataValues.OrderStatus == 'Pending') {
                const CurrentDateTime = moment.tz(new Date(), "Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss');
                await db.order.update({
                    OrderStatus: 'Confirmed',
                    UpdatedOn: CurrentDateTime
                }, {
                    where: {
                        OrderID: req.OrderID,
                        LocationID: req.LocationID,
                    },
                }, {
                    transaction: db_transaction, // Use the transaction
                });

                await db.orderHistory.create(
                    {
                        OrderID: req.OrderID,
                        OrderStatus: 'Confirmed',
                        Data: req.Data,
                        CreatedOn: CurrentDateTime
                    },
                    {
                        transaction: db_transaction, // Use the transaction
                    }
                );

                await db_transaction.commit();

                return {
                    status: 1,
                    message: 'Order has been confirmed'
                }

            } else {
                return {
                    status: 0,
                    message: "This order has already been updated to " + OrderList.dataValues.OrderStatus + " status."
                }
            }
        } else {
            return {
                status: 0,
                message: 'Permission denied'
            }
        }
    } catch (error) {
        return {
            status: 0,
            message: error.message
        }
    }
};

const OrderReject = async (req) => {
    try {
        req = req.message;

        const db_transaction = await db.sequelize.transaction();
        const OrderList = await db.order.findOne({
            where: {
                OrderID: req.OrderID,
                LocationID: req.LocationID,
            },
        });
        if (OrderList) {
            if (OrderList.dataValues.OrderStatus == 'Pending') {
                req.Data.Reason = req.Reason;
                req.Data.Remark = req.Remark;

                const CurrentDateTime = moment.tz(new Date(), "Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss');
                await db.order.update({
                    OrderStatus: 'Cancelled',
                    UpdatedOn: CurrentDateTime,
                    Reason: req.Reason,
                    Remark: req.Remark
                }, {
                    where: {
                        OrderID: req.OrderID,
                        LocationID: req.LocationID,
                    },
                }, {
                    transaction: db_transaction, // Use the transaction
                });

                await db.orderHistory.create(
                    {
                        OrderID: req.OrderID,
                        OrderStatus: 'Cancelled',
                        Data: req.Data,
                        CreatedOn: CurrentDateTime
                    },
                    {
                        transaction: db_transaction, // Use the transaction
                    }
                );

                await db_transaction.commit();

                return {
                    status: 1,
                    message: 'Order has been Cancelled'
                }

            } else {
                return {
                    status: 0,
                    message: "This order has already been updated to " + OrderList.dataValues.OrderStatus + " status."
                }
            }
        } else {
            return {
                status: 0,
                message: 'Permission denied'
            }
        }
    } catch (error) {
        return {
            status: 0,
            message: error.message
        }
    }
};


const OrderPending = async (LocationID) => {
    try {
        const OrderList = await db.order.findAll({
            where: {
                OrderStatus: 'Pending',
                LocationID: LocationID,
            },
        });
        return {
            status: 1,
            data: OrderList
        }
    } catch (error) {
        return {
            status: 0,
            message: error.message
        }
    }
};

async function getOrderListUser(req, res) {
    try {
        const { UserDetail } = req;

        if (!UserDetail || !UserDetail.CustomerID) {
            return res.status(400).json({
                message: "Invalid Token! Login again"
            })
        }

        const { page, size } = req.query;
        const limit = size ? Number(size) : 5;
        const offset = (Number(page) - 1) * limit;
        const orderList = await db.order.findAll({
            where: { CustomerID: UserDetail.CustomerID },
            limit: limit,
            offset: offset
        });

        return res.status(200).json({
            message: 'Success',
            orders: orderList
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Sorry! There was an server-side error',
            error: error
        });
    }
}

async function getOrderDetail(req, res) {
    try {
        const { UserDetail } = req;

        if (!UserDetail || !UserDetail.CustomerID) {
            return res.status(400).json({
                message: "Invalid Token! Login again"
            })
        }
        const { orderId } = req.query;
        if (!orderId) {
            return res.status(404).json({
                message: "Order not found"
            })
        }

        const whereCondition = {};
        whereCondition.OrderID = orderId;

        const orderDetailed = await db.orderDetails.findOne({
            where: whereCondition
        })
        return res.status(200).json({
            message: 'Success',
            orderDetail: orderDetailed
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Sorry! There was an server-side error',
            error: error
        });
    }
}

module.exports = { AddOrder, OrderApprove, OrderReject, OrderPending, getOrderDetail, getOrderListUser };