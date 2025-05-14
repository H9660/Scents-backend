import {
  loginData,
  registerData,
  otpData,
  cartData,
  getCartData,
} from "../parsers/Parsers.js";
import prismaClient from "../db/index.js";
import twilio from "twilio";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_ACCOUNT_TOKEN;
const client = twilio(accountSid, token);

const generateOTP = (len: number) => {
  return Math.floor(
    Math.pow(10, len - 1) + Math.random() * Math.pow(10, len - 1) * 9
  ).toString();
};

const sendOTP = async (phoneNumber: string, otp: string) => {
  try {
    await client.messages.create({
      body: `Dear user. Your OTP for SCENTS is: ${otp}`,
      from: "+16073177382",
      to: phoneNumber,
    });
    console.log("OTP sent via SMS!");
  } catch (error) {
    console.error("Error sending OTP:", error);
  }
};
export const loginUser = async (req: any, res: any) => {
  const parsedBody = loginData.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(411).json({
      message: "Please check the login data.",
    });
    return;
  }

  const User = await prismaClient.user.findFirst({
    where: {
      phone: parsedBody.data.phone,
    },
  });

  if (!User) {
    res.status(404).json({ message: "User not found." });
    return;
  }

  const OTP = generateOTP(6);
  console.log(OTP);
  const parsedPhoneno = "+91" + parsedBody.data.phone;
  sendOTP(parsedPhoneno, OTP);
  try {
    await prismaClient.oTP.update({
      where: {
        phone: parsedBody.data.phone,
      },
      data: {
        otp: OTP,
      },
    });
    res.status(200).send({
      otp: OTP,
    });
  } catch (otpError) {
    console.error("Error creating OTP:", otpError);
    return res.status(500).json({ error: otpError });
  }
};

export const verifyOTP = async (req: any, res: any) => {
  const parsedBody = otpData.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(411).json({
      message: "Please check the otp again.",
    });
    return;
  }

  const savedOTP = await prismaClient.oTP.findFirst({
    where: { phone: parsedBody.data.phone },
  });

  console.log("saved", savedOTP);
  console.log("got", parsedBody.data.otp);
  if (savedOTP?.otp == req.body.otp) {
    console.log("in it");
    const existingUser = await prismaClient.user.findFirst({
      where: { phone: parsedBody.data.phone },
    });
    let newUser = null;
    if (existingUser == null) {
      newUser = await prismaClient.user.create({
        data: {
          name: parsedBody.data.name,
          phone: parsedBody.data.phone,
        },
      });
    }
    res.status(200).json({
      message: "Success",
      user: existingUser !== null ? existingUser : newUser,
    });
    return;
  }

  res.status(400).json({
    message: "OTP is invalid",
  });
};

export const registerUser = async (req: any, res: any) => {
  const parsedBody = registerData.safeParse(req.body);

  if (!parsedBody.success) {
    res.status(411).json({
      message: "Please check the input data.",
    });
    return;
  }

  const User = await prismaClient.user.findFirst({
    where: {
      phone: parsedBody.data.phone,
    },
  });

  if (User) {
    res.status(400).json({ message: "User already exists. Please login." });
    return;
  }

  const OTP = generateOTP(6);
  const parsedPhoneno = "+91" + parsedBody.data.phone;
  sendOTP(parsedPhoneno, OTP);
  console.log(OTP);
  // cache this otp here so that it doesnt generate again and again
  try {
    await prismaClient.oTP.upsert({
      where: {
        phone: parsedBody.data.phone, // Condition to find an existing record
      },
      update: {
        otp: OTP,
      },
      create: {
        phone: parsedBody.data.phone,
        otp: OTP,
      },
    });

    return res.status(200).json({
      otp: OTP,
    });
  } catch (otpError) {
    console.error("Error creating OTP:", otpError);
    return res.status(500).json({ error: "Failed to generate OTP" });
  }
};

export const updateCart = async (req: any, res: any) => {
  const parsedBody = cartData.safeParse(req.body);
  console.log(req.body);
  if (!parsedBody.success) {
    res.status(411).json({
      message: "Please check the input data.",
    });
    return;
  }

  let userCart = await prismaClient.cart.findFirst({
    where: {
      userId: parsedBody.data.userId,
    },
  });

  try {
    const usercartMap = new Map(Object.entries(userCart?.cartData || {}));
    const gotCartMap = new Map(Object.entries(parsedBody.data.cart || {}));
    for (const [product, count] of gotCartMap) {
      const Perfume = await prismaClient.perfume.findFirst({
        where: {
          name: product, // Find perfume by name
        },
      });

      if (Perfume) {
        if (!usercartMap.has(product)) {
          usercartMap.set(product, {
            imageUrl: Perfume.imageUrl,
            quantity: 0,
            price: 0,
          });
        }

        usercartMap.set(product as string, {
          imageUrl: Perfume.imageUrl,
          quantity: (usercartMap.get(product).quantity || 0) + count,
          price:
            (usercartMap.get(product).price || 0) +
            Perfume.price * (count as number),
        });
      }
    }

    const totalPrice = Array.from(usercartMap.values()) // Get all values (cart items)
      .reduce((sum, item) => sum + item.price, 0); // Sum up the price values

    try {
      await prismaClient.cart.update({
        where: { userId: parsedBody.data.userId },
        data: {
          userId: parsedBody.data.userId,
          cartData: Object.fromEntries(usercartMap),
          cartPrice: totalPrice,
        },
      });
    } catch (error) {
      console.log("enter");
      await prismaClient.cart.create({
        data: {
          userId: parsedBody.data.userId,
          cartData: Object.fromEntries(usercartMap),
          cartPrice: totalPrice,
        },
      });
    }

    return res.status(200).json({
      price: totalPrice,
      cartid: userCart?.id,
    });
  } catch (otpError) {
    console.error("Error updating cart:", otpError);
    return res.status(500).json({ error: "Failed to update cart." });
  }
};

export const getCart = async (req: any, res: any) => {
  try {
    const parsedBody = getCartData.safeParse({ userId: req.query.userId });
    if (!parsedBody.success) {
      res.status(411).json({
        message: "Please check the input data.",
      });
      return;
    }

    const userCart = await prismaClient.cart.findFirst({
      where: {
        userId: parsedBody.data.userId,
      },
    });

    let cart = {};
    let price = 0;

    if (userCart && userCart.cartData) {
      cart = userCart.cartData;
      price = userCart.cartPrice;
    }
    return res.status(200).json({
      cart: cart,
      price: price,
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

export const getOrders = async (req: any, res: any) => {
  try {
    console.log("tests");
    const userId = req.body.userId;
    const User = await prismaClient.user.findFirst({
      where: {
        id: userId as string,
      },
      include: { transactions: true },
    });

    if (!User) {
      res.status(404).json({
        error: "User not found!",
      });
    }

    return res.status(200).json({
      error: "",
      orders: User?.transactions,
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

export const deletecart = async (req: any, res: any) => {
  try {
    const userId = req.body.userId;
    await prismaClient.cart.deleteMany({
      where: {
        userId: userId,
      },
    });
    const User = await prismaClient.user.update({
      where: {
        id: userId as string,
      },

      data: {
        cart: {},
      },
      include: {
        transactions: true,
      },
    });

    if (!User) {
      res.status(404).json({
        error: "User not found!",
      });
    }

    return res.status(200).json({
      error: "",
      orders: User?.transactions,
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};
