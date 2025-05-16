import express from "express";
const router = express.Router();
import { initiatePayment, verifyPayment, createTransaction } from "../controllers/paymentController.js";
import {authMiddleware} from "../middleware/authMiddleware.js"
router.use(authMiddleware)
router.post("/makePayment", initiatePayment);
router.post("/verifyPayment", verifyPayment);
router.post("/createTransaction", createTransaction);
export default router
