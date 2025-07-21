import express from "express";
import { getOrder } from "../controllers/getOrderController.js";

const router = express.Router();

router.get("/:userId", getOrder);

export const getOrderRoutes = router;
