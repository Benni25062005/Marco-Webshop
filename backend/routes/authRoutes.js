import express from "express";
import { getCurrentUser } from "../controllers/authController.js";

const router = express.Router();

router.get("/me", getCurrentUser);

export const authRoutes = router;
