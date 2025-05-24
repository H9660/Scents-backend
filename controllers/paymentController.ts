import Razorpay from "razorpay";
import crypto from "crypto";
import {
  paymentData,
  transactionData,
  verifyPaymentData,
} from "../parsers/Parsers.js";
import prismaClient from "../db/index.js";
import dotenv from 'dotenv'
dotenv.config()
const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;
export const initiatePayment = async (req: any, res: any) => {
  console.log(key_id)
  console.log(key_secret)
  if (req.method !== "POST") return res.status(405).end();

  try {
    console.log(req.body);
    const parsedBody = paymentData.safeParse(req.body);

    if (!parsedBody.success) {
      res.status(411).json({ message: "Please check the input data." });
      return;
    }

    const razorpay = new Razorpay({
      key_id: key_id,
      key_secret: key_secret,
    });

    const options = { amount: parsedBody.data.amount, currency: "INR" }; // FIX: `amount` should be used, not `userId`
    const order = await razorpay.orders.create(options);
    res.status(200).json({ order });
  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const verifyPayment = async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).end();

  try {
    console.log(req.body);
    const parsedBody = verifyPaymentData.safeParse(req.body);

    if (!parsedBody.success) {
      res.status(411).json({ message: "Please check the input data." });
      return;
    }

    const generatedSignature = crypto
      .createHmac("sha256", key_secret as string)
      .update(
        parsedBody.data.razorpay_order_id +
          "|" +
          parsedBody.data.razorpay_payment_id
      )
      .digest("hex");
    if (generatedSignature == parsedBody.data.razorpay_signature) {
      console.log("valid");
      res.status(200).json({
        success: true,
      });
    } else {
      console.log("invalid");
      res.status(500).json({
        success: false,
      });
    }
  } catch (error) {
    res.status(500)
    throw new Error("Internal server error")
  }
};

export const createTransaction = async (req: any, res: any) => {
  try {
    console.log(req.body);
    const parsedBody = transactionData.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(411).json({ message: "Please check the input data." });
      return;
    }
    
    if (parsedBody.data) {
      const transaction = await prismaClient.transactions.create({
        data: {
          userId: parsedBody?.data?.userId,
          razorpay_order_id: parsedBody.data.razorpay_order_id,
          razorpay_payment_id: parsedBody.data.razorpay_payment_id,
          status: parsedBody.data.status,
          orderDetails: parsedBody.data.orderDetails,
          subtotal: parsedBody.data.subtotal,
          address: parsedBody.data.address
        },
      });

      res.status(200).json({
        transactionId: transaction.transactions_id,
      });
    } else res.status(411).send("The body is empty!");
  } catch (error) {
    res.status(500)
    throw new Error("Internal server error")
  }
};
