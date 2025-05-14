import { z } from "zod";
export const loginData = z.object({
  phone: z.string(),
});

export const registerData = z.object({
  name: z.string(),
  phone: z.string(),
});

export const perfumeData = z.object({
  name: z.string(),
  price: z.number(),
  quantity: z.string(),
  imageUrl: z.string().optional(),
});

export const perfumeGetData = z.object({
  name: z.string(),
});

export const perfumeUpdateData = z.object({
  name: z.string(),
  newName: z.string().optional(),
  price: z.number().optional(),
  imageUrl: z.string().optional(),
  discription: z.string().optional(),
});

export const perfumeDeleteData = z.object({
  name: z.string(),
});

export const otpData = z.object({
  phone: z.string(),
  name: z.string(),
  otp: z.string(),
});

export const cartData = z.object({
  cart: z.record(z.number()), // Maps product names to counts
  userId: z.string(),
});

export const getCartData = z.object({
  userId: z.string(),
});

export const paymentData = z.object({
  amount: z.number(),
  userId: z.string(),
});

export const verifyPaymentData = z.object({
  razorpay_payment_id: z.string(),
  razorpay_order_id: z.string(),
  razorpay_signature: z.string(),
});

export const transactionData = z.object({
  razorpay_payment_id: z.string(),
  razorpay_order_id: z.string(),
  userId: z.string(),
  subtotal: z.number(),
  status: z.enum(["Pending", "Completed", "Failed"]),
});
