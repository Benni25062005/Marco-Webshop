import express from "express";
import {
  saferpayInitialize,
  saferpayConfirm,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/saferpay/initialize", saferpayInitialize);
router.post("/saferpay/confirm", saferpayConfirm);

export default router;
