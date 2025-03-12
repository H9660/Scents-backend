import express from "express";
const router = express.Router();
import { registerUser, loginUser, verifyOTP, updateCart, getCart} from "../controllers/userController.js";
// we need to protect the middle ware thats why we are adding the middel ware here

router.get("/getCart", getCart);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verifyotp", verifyOTP);
router.patch("/updatecart", updateCart);
export default router
