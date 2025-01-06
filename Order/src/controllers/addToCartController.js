const axios = require("axios");
const db = require("../models/index.js");


const addToCart = async (req, res) => {
  try {
    const customerID = req.UserDetail.CustomerID;

    if (!customerID) {
      return res.status(401).json({ message: "Unauthorized: CustomerID missing in token" });
    }

    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid items array" });
    }

    const cartItems = [];

    for (const item of items) {
      const { ItemID, Quantity, OrderStatus } = item;

      if (!ItemID || Quantity <= 0) {
        return res.status(400).json({ message: "Invalid ItemID or Quantity in items array" });
      }

      let catalogResponse;
      try {
        catalogResponse = await axios.get(`http://localhost:302/api/v1/items/${ItemID}`);
        console.log("🚀 ~ Catalog item details:", catalogResponse.data);
      } catch (error) {
        console.error(`🚀 Error fetching item (ID: ${ItemID}) from catalog:`, error.response?.data || error.message);
        return res.status(404).json({
          message: `Failed to fetch item (ID: ${ItemID}) from catalog`,
          error: error.response?.data || error.message
        });
      }

      // Ensure item was fetched successfully
      if (!catalogResponse || catalogResponse.status !== 200 || !catalogResponse.data || !catalogResponse.data.itemDetails) {
        return res.status(404).json({ message: `Item (ID: ${ItemID}) not found in catalog` });
      }

      const { ItemName, MRP, UnitRate } = catalogResponse.data.itemDetails;
      if (!ItemName || !MRP || !UnitRate) {
        return res.status(400).json({ message: `Missing essential details for item (ID: ${ItemID}) in catalog response` });
      }

      const finalOrderStatus = OrderStatus || "Pending";

      const cartItem = await db.order.create({
        CustomerID: customerID,
        ItemID,
        Quantity,
        ItemName,
        MRP,
        OrderStatus: finalOrderStatus
      });

      cartItems.push(cartItem); 
    }

    return res.status(200).json({
      message: "Items added to cart successfully",
      cartItems
    });
  } catch (error) {
    console.error("🚀 Error in addToCart:", error.response?.data || error.message);
    return res.status(400).json({ message: "Internal server error", error: error.message });
  }
};


const clearCart = async (req, res) => {
  try {
    const customerID = req.UserDetail.CustomerID;

    if (!customerID) {
      return res.status(401).json({ message: "Unauthorized: CustomerID missing in token" });
    }

    // Find and delete all items with "Pending" status in the customer's cart
    const deletedItems = await db.order.destroy({
      where: {
        CustomerID: customerID,
        OrderStatus: 'Pending'
      }
    });

    if (deletedItems === 0) {
      return res.status(404).json({ message: "No pending items found in the cart to delete" });
    }

    return res.status(200).json({
      message: "All pending items have been removed from the cart successfully"
    });
  } catch (error) {
    console.error("🚀 Error in clearPendingItems:", error.response?.data || error.message);
    return res.status(400).json({ message: "Internal server error", error: error.message });
  }
};


const viewCart = async (req, res) => {
  try {
    const customerID = req.UserDetail.CustomerID;

    if (!customerID) {
      return res.status(401).json({ message: "Unauthorized: CustomerID missing in token" });
    }

    const updatedquntity = req.body.updatedquntity || [];

    
    const cartItems = await db.order.findAll({
      where: { CustomerID: customerID, OrderStatus: 'Pending' }
    });

    if (cartItems.length === 0) {
      return res.status(404).json({ message: "Your cart is empty" });
    }

    
    for (let item of cartItems) {
      
      const updatedItem = updatedquntity.find(u => u.ItemID === item.ItemID);
      
      if (updatedItem) {
        if (updatedItem.Quantity > 0 && updatedItem.Quantity !== item.Quantity) {
          item.Quantity = updatedItem.Quantity;

          const finalRate = parseFloat(item.MRP) * item.Quantity;
          item.FinalRate = finalRate.toFixed(2);

          await item.save();
        }
      }
    }

 
    const cartItemsWithFinalRate = cartItems.map(item => {
      const finalRate = parseFloat(item.MRP) * item.Quantity;
      return {
        OrderID: item.OrderID,
        CustomerID: item.CustomerID,
        ItemID: item.ItemID,
        ItemName: item.ItemName,
        Quantity: item.Quantity,
        FinalRate: finalRate.toFixed(2),
        OrderStatus: item.OrderStatus
      };
    });

    return res.status(200).json({
      message: "Cart items fetched and updated successfully",
      cartItems: cartItemsWithFinalRate
    });
  } catch (error) {
    console.error("Error fetching and updating cart items:", error.message);
    return res.status(400).json({ message: "Internal server error", error: error.message });
  }
};


const waitingOrders = async (req, res) => {
  try {
    const customerId = req.UserDetail.CustomerID;

    
    const pendingOrders = await db.order.findAll({
      where: {
        CustomerID: customerId,
        OrderStatus: "Pending"
      },
      attributes: ['OrderID', 'CustomerID', 'ItemName', 'Quantity', 'MRP', 'OrderStatus']
    });

    if (!pendingOrders || pendingOrders.length === 0) {
      return res.status(400).json({ message: "No pending orders found" });
    }

    // Format the response data
    const orders = pendingOrders.map(order => {
      const totalAmount = order.MRP * order.Quantity;
      return {
        OrderID: order.OrderID,
        CustomerID: order.CustomerID,
        Items: [
          {
            ItemName: order.ItemName,
            Quantity: order.Quantity,
            MRP: order.MRP,
            TotalAmount: totalAmount
          }
        ],
        OrderStatus: order.OrderStatus,
        EstimatedApprovalTime: "1-2 minutes"
      };
    });

    return res.status(200).json({ orders });
  } catch (error) {
    console.error(" ~ Error fetching pending orders:", error);
    return res.status(400).json({ message: "Error fetching pending orders", error: error.message });
  }
};


const updateOrderStatus = async (req, res) => {
  try {
    const { orderIDs, action } = req.body;  // Expecting an array of orderIDs
    const customerID = req.UserDetail.CustomerID;

    if (!orderIDs || !Array.isArray(orderIDs) || orderIDs.length === 0 || !action) {
      return res.status(400).json({ message: "OrderIDs array and action are required" });
    }

    // Validate the action
    let updatedStatus;
    if (action === 'approve') {
      updatedStatus = "Accepted";
    } else if (action === 'decline') {
      updatedStatus = "Declined";
    } else {
      return res.status(400).json({ message: "Invalid action. Use 'approve' or 'decline'." });
    }

    // Find and update orders
    const orders = await db.order.findAll({
      where: {
        OrderID: orderIDs,
        CustomerID: customerID,
        OrderStatus: "Pending"
      },
      attributes: ['OrderID', 'CustomerID', 'ItemID', 'ItemName', 'Quantity', 'MRP', 'OrderStatus'],
    });

    if (orders.length === 0) {
      return res.status(404).json({ message: "No matching orders found or already processed" });
    }

    // Process each order
    for (let order of orders) {
      order.OrderStatus = updatedStatus;
      await order.save();  // Save the updated status
    }

    // Prepare the response with updated orders
    const updatedOrders = orders.map(order => {
      const totalAmount = parseFloat(order.MRP) * parseInt(order.Quantity);
      return {
        OrderID: order.OrderID,
        CustomerID: order.CustomerID,
        ItemID: order.ItemID,
        ItemName: order.ItemName,
        Quantity: order.Quantity,
        MRP: order.MRP,
        TotalAmount: totalAmount,
        OrderStatus: order.OrderStatus
      };
    });

    return res.status(200).json({
      message: `Orders have been ${updatedStatus} successfully`,
      updatedOrders
    });
  } catch (error) {
    console.error(" ~ Error in updateOrderStatus:", error);
    return res.status(400).json({ message: "Internal server error", error: error.message });
  }
};



module.exports = { addToCart, clearCart, viewCart,waitingOrders, updateOrderStatus};

