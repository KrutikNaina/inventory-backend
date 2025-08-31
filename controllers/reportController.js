// controllers/reportController.js
import Order from "../models/Order.js";
import { generateSalesReport } from "../services/aiService.js";

export const generateReportController = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get orders for the authenticated user and populate product details
    const orders = await Order.find({ handledBy: userId })
      .populate('products.productId')
      .sort({ createdAt: -1 });

    if (!orders.length) {
      return res.status(404).json({ 
        success: false,
        message: "No orders found for this user" 
      });
    }

    // Format orders for processing
    const formattedOrders = orders.map(order => ({
      _id: order._id,
      products: order.products.map(product => ({
        productId: product.productId?.name || "Unknown Product",
        quantity: product.quantity || 0
      })),
      createdAt: order.createdAt
    }));

    const report = await generateSalesReport(formattedOrders);
    
    res.json({ 
      success: true,
      report,
      orderCount: orders.length,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Report Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to generate report",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};