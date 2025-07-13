import express from "express";
import { sendCode, verifyCode } from "../controllers/smsController.js";

const router = express.Router();

router.post("/send-sms-code", sendCode);
router.post("/verify-sms-code", verifyCode);

export default router;