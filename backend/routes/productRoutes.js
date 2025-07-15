import express from "express";
const router = express.Router();
import { getAllProducts } from "../controllers/productController.js";

router.get('/products', getAllProducts);

export const productRouter = router;
