import {
  loginData,
  registerData,
  cartData,
  getCartData,
} from "../parsers/Parsers.js";
import asyncHandler from 'express-async-handler';
import bcrypt from "bcryptjs";
import prismaClient from "../db/index.js";
import { generateToken } from "../utils/tokenGenerator.js";
export const loginUser = asyncHandler( async (req: any, res: any, next: any) => {
  console.log(req.body);
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

  if (User && (await bcrypt.compare(parsedBody.data.password, User.password))) {
    const token = generateToken(User.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.ENV === "production",
      sameSite: "strict",
      maxAge: 86400000, 
    });

    res.json({
      id: User.id,
      name: User.name,
      phone: User.phone,
      token: token,
      createdAt: User.createdAt
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials")
  }

});

export const registerUser = asyncHandler( async (req: any, res: any, next: any) => {
  const parsedBody = registerData.safeParse(req.body);

  if (!parsedBody.success) {
    res.status(411).json({
      message: "Please check the input data.",
    });
    return;
  }

  const existingUser = await prismaClient.user.findFirst({
    where: {
      phone: parsedBody.data.phone,
    },
  });

  if (existingUser) {
    res.status(400).json({ message: "User already exists. Please login." });
    return;
  }
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(parsedBody.data.password, salt);

  const newUser = await prismaClient.user.create({
    data: {
      name: parsedBody.data.name,
      phone: parsedBody.data.phone,
      password: hashedPassword,
    },
  });

  if (newUser) {
    const token = generateToken(newUser.id)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 86400000,
    });

    res.status(201).json({
      _id: newUser.id,
      name: newUser.name,
      phone: newUser.phone,
      token: token,
      createdAt: newUser.createdAt
    });
  } else {
    res.status(500);
    next("Invalid credentials")
  }
  
});

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
  try{const parsedBody = getCartData.safeParse({ userId: req.query.userId });
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
  
  console.log("User cart is", userCart)
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
}catch(error){
  res.status(500).json({
    error: error,
  });
}
};

export const getOrders = async (req: any, res: any) => {
  try {

    console.log("tests")
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

export const deletecart = async (req: any, res: any)=>{
  try {

    const userId = req.body.userId;
    await prismaClient.cart.deleteMany({
      where:{
        userId: userId
      }
    })
    const User = await prismaClient.user.update({
      where: {
        id: userId as string,
      },

      data:{
        cart: {}
      },
      include:{
        transactions: true
      }
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
}