import { saveOrder } from "../models/orderModel.js";

export const createOrder = async (req, res) => {
  const orderData = req.body;

  if (
    !orderData.items ||
    !Array.isArray(orderData.items) ||
    orderData.items.length === 0
  ) {
    return res
      .status(400)
      .json({ error: "Keine Artikel in Bestellung übergeben." });
  }

  try {
    const orderId = await saveOrder(orderData);
    res.status(201).json({ message: "order created", orderId });
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({ error: "Order creation failed" });
  }
};
