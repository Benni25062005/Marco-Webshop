import express from "express";
const router = express.Router();
import { getProductById } from "../controllers/productDetailController.js";

router.get("/products/:id", getProductById);

export const productDetailRouter = router;
