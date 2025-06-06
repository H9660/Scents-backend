import { z } from "zod";
export const loginData = z.object({
  phone: z.string(),
  password: z.string()
});

export const registerData = z.object({
  name: z.string(),
  phone: z.string(),
  password: z.string()
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

export const cartData = z.object({
  cart: z.record(z.number()), // Maps product names to counts
  userId: z.string(),
});

export const orderDetails = z.object({
  cart: z.record(
    z.object({
      imageUrl: z.string().url(),
      price: z.number(),
      quantity: z.number(),
    })
  ),
  userId: z.string(),
});

export const transactionData = z.object({
  razorpay_payment_id: z.string(),
  razorpay_order_id: z.string(),
  userId: z.string(),
  subtotal: z.number(),
  status: z.enum(["Pending", "Completed", "Failed"]),
  orderDetails: orderDetails,
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    pincode: z.string()
  })
});



// TransactionIdFormat
const TransactionIdFormat = z.object({
  transactionId: z.string(),
});

// cartItemFormat
export const cartItemFormat = z.object({
  imageUrl: z.string().url(),
  price: z.number(),
  quantity: z.number().int().nonnegative(),
});

// NumberRecord = Record<string, cartItemFormat>
export const NumberRecord = z.record(cartItemFormat);

// AddressFormat
const AddressFormat = z.object({
  city: z.string(),
  street: z.string(),
  state: z.string(),
  pincode: z.string(),
  country: z.string(),
});

const CartDataFormat = z.object({
  cart: z.record(cartItemFormat),  // the original cart items
  price: z.number(),                 // the total price field
});

// Final emailData schema
export const emailData = z.object({
  name: z.string(),
  email: z.string().email(),
  transactionId: z.string(),
  cartdata: CartDataFormat,
  address: AddressFormat,
});

