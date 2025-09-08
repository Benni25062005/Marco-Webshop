import db from "../config/db.js";

export const getProductById = async (req, res) => {
  const id = req.params.id;
  const q = "SELECT * FROM produkte WHERE idProdukt = ?";

  try {
    const [rows] = await db.execute(q, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Produkt nicht gefunden" });
    }

    const product = {
      ...rows[0],
      Details: rows[0].Details ? JSON.parse(rows[0].Details) : null,
    };

    return res.json(product);
  } catch (err) {
    console.error("Fehler bei getProductById:", err);
    return res.status(500).json({ error: err.code || String(err) });
  }
};
