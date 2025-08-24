import express from "express";
import {
  createTwintPayment,
  checkTwintPaymentStatus,
} from "../controllers/twintController.js";

const router = express.Router();

// TWINT QR-Code Payment erstellen
router.post("/create-payment", createTwintPayment);

// Payment Status abfragen
router.get("/status/:sessionId", checkTwintPaymentStatus);

export const twintRoutes = router;
