import db from "../config/db.js";


export const getProductById = (req, res) => {
  const id = req.params.id;
  const q = "SELECT * FROM produkte WHERE idProdukt = ?";

  db.query(q, [id], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json({ message: "Produkt nicht gefunden" });

    const product = {
      ...data[0],
      Details: data[0].Details ? JSON.parse(data[0].Details) : null,
    };

    res.json(product);
  });
};
