import Razorpay from "razorpay";
import crypto from "crypto";
import { paymentData, verifyPaymentData } from "../parsers/Parsers.js";
export const initiatePayment = async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).end();

  try {
    console.log(req.body);
    const parsedBody = paymentData.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(411).json({ message: "Please check the input data." });
    }

    const razorpay = new Razorpay({
      key_id: "rzp_test_UZYDhupdHjejNu",
      key_secret: "eqgAnhAwP28XUjZAlb3pqx9k",
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
      return res.status(411).json({ message: "Please check the input data." });
    }

    const generatedSignature = crypto
      .createHmac("sha256", "eqgAnhAwP28XUjZAlb3pqx9k")
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
    console.error("Payment Error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
