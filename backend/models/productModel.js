import db from "../config/db.js";

export const getAllProducts = async () => {
  try {
    const [rows] = await db.execute("SELECT * FROM produkte");
    return rows;
  } catch (err) {
    console.error("Fehler bei getAllProducts:", err);
    throw err;
  }
};
