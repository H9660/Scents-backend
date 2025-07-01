import express from "express";
const router = express.Router();
import { registerUser, loginUser, updateCart, getCart, getOrders, deletecart, getAllOrders, getMe} from "../controllers/userController.js";
import {authMiddleware} from "../middleware/authMiddleware.js"

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getAllOrders", getAllOrders)
router.use(authMiddleware)
router.get("/getCart", getCart);
router.get("/me", getMe)
router.patch("/updatecart", updateCart);
router.get("/getOrders", getOrders)
router.delete("/deletecart", deletecart);
export default router
