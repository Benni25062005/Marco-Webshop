import { saveOrder } from "../services/orderService.js";

export const createOrder = async (req, res) => {
  try {
    const data = await saveOrder(req.body);
    return res.status(201).json({ success: true, ...data });
  } catch (err) {
    console.error("Order erstellen fehlgeschlagen:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
