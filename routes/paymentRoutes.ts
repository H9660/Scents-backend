import express from "express";
const router = express.Router();
import { initiatePayment, verifyPayment } from "../controllers/paymentController.js";

router.post("/makePayment", initiatePayment);
router.post("/verifyPayment", verifyPayment);
export default router
