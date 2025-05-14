import express from "express";
const router = express.Router();
import { registerUser, loginUser, verifyOTP, updateCart, getCart, getOrders, deletecart} from "../controllers/userController.js";

router.get("/getCart", getCart);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verifyotp", verifyOTP);
router.patch("/updatecart", updateCart);
router.get("/getOrders", getOrders)
router.delete("/deletecart", deletecart);
export default router
