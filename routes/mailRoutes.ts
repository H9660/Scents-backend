import express from "express";
const router = express.Router();
import { sendMail } from "../controllers/mailController.js";
import {authMiddleware} from "../middleware/authMiddleware.js"
router.use(authMiddleware)
router.post("/", sendMail)
export default router
