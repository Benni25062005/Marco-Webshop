import { fetchAllProducts } from "../services/productService.js";

export const getAllProducts = async (req, res) => {
    try {
        const products = await fetchAllProducts();
        res.status(200).json(products);
    } catch (err) {
        console.error('Fehler beim laden der Produkte', err);
        res.status(500).json({ error: 'Serverfehler'});

    }
}