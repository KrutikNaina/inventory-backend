// services/aiService.js
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to generate AI-based sales report with fallback
export async function generateSalesReport(orders) {
  try {
    if (!orders || orders.length === 0) {
      console.log("No orders available to generate report");
      return "No orders to analyze.";
    }

    // Try to use OpenAI first
    try {
      const prompt = createOpenAIPrompt(orders);
      
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      });

      return response.choices[0].message.content;
    } catch (openaiError) {
      console.warn("OpenAI API failed, using local analysis:", openaiError.message);
      
      // Fallback: Generate a local report
      return generateLocalReport(orders);
    }
  } catch (error) {
    console.error("Report generation failed:", error);
    return `Report generation failed: ${error.message}`;
  }
}

// Create prompt for OpenAI
function createOpenAIPrompt(orders) {
  const orderSummary = orders
    .map((order) => {
      const products = order.products
        .map((p) => `${p.productId || "Unknown"} (Qty: ${p.quantity})`)
        .join(", ");
      return `Order ID: ${order._id}, Products: ${products}, Date: ${order.createdAt}`;
    })
    .join("\n");

  return `
    Analyze the following sales data and generate a business-friendly report:
    ${orderSummary}

    Please provide insights on:
    1. Best-selling products and categories
    2. Stock alerts (products that may run out based on sales velocity)
    3. Recommendations for upcoming inventory purchases
    4. Seasonal trends or patterns you notice
    5. Any other valuable business insights
    
    Format the response in a clear, organized manner with sections.
  `;
}

// Generate local report without OpenAI
function generateLocalReport(orders) {
  if (!orders || orders.length === 0) {
    return "No orders to analyze.";
  }

  // Analyze products and quantities
  const productSales = {};
  let totalItems = 0;
  
  orders.forEach(order => {
    order.products.forEach(product => {
      const productName = product.productId || "Unknown Product";
      productSales[productName] = (productSales[productName] || 0) + product.quantity;
      totalItems += product.quantity;
    });
  });

  // Find best sellers
  const sortedProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Generate report
  let report = "🤖 SMART INVENTORY AI REPORT (Local Analysis)\n";
  report += "=".repeat(50) + "\n\n";
  
  report += "📈 EXECUTIVE SUMMARY:\n";
  report += `• Total Orders: ${orders.length}\n`;
  report += `• Total Items Sold: ${totalItems}\n\n`;
  
  report += "🏆 TOP SELLING PRODUCTS:\n";
  sortedProducts.forEach(([product, quantity], index) => {
    report += `${index + 1}. ${product}: ${quantity} units sold\n`;
  });
  
  report += "\n⚠️  STOCK ALERTS:\n";
  sortedProducts.slice(0, 3).forEach(([product, quantity]) => {
    report += `• Monitor stock levels for: ${product} (high demand)\n`;
  });
  
  report += "\n💡 RECOMMENDATIONS:\n";
  report += "- Consider restocking top-selling items\n";
  report += "- Analyze sales patterns for seasonal trends\n";
  report += "- Review inventory levels for fast-moving products\n\n";
  
  report += "Note: Using local analysis. For advanced AI insights, check your OpenAI API billing status.\n";
  report += "Generated on: " + new Date().toLocaleString();

  return report;
}

// Export the main function as default
export default { generateSalesReport };