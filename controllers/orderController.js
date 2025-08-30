// controllers/orderController.js
const Product = require("../models/Product");
const Order = require("../models/Order");
const StockLog = require("../models/StockLog");

exports.createOrder = async (req, res) => {
  try {
    const { orderType, products, supplierOrBuyer } = req.body;

    const order = new Order({
      orderType,
      products,
      supplierOrBuyer,
      handledBy: req.user.id
    });

    for (let item of products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stockQty: orderType === "inward" ? item.quantity : -item.quantity }
      });

      await StockLog.create({
        productId: item.productId,
        action: orderType === "inward" ? "added" : "removed",
        quantity: item.quantity,
        userId: req.user.id,
        orderId: order._id
      });
    }

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
