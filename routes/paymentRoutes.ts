import express from "express";
const router = express.Router();
import { initiatePayment, verifyPayment } from "../controllers/paymentController.ts";

router.post("/makePayment", initiatePayment);
router.post("/verifyPayment", verifyPayment);
export default router
