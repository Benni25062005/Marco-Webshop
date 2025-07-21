import { getOrder as fetchOrderFromDB } from "../models/getOrderModel.js";

export const getOrder = async (req, res) => {
  const { userId } = req.params;


  if (!userId) {
    return res.status(400).json({ error: "Kein User gefunden" });
  }

  try {
    const result = await fetchOrderFromDB(userId);

    res.status(200).json(result); 
  } catch (error) {
    console.error("❌ Fehler im Controller:", error);
    res.status(500).json({ error: "Serverfehler" });
  }
};
