import jwt from "jsonwebtoken";
import prismaClient from "../db/index.js";

export const authMiddleware = async (req: any, res: any, next: any) => {
  try {
    const token = req.cookies.token; 
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "TEST101") as any;
    console.log(decoded)
    req.user = await prismaClient.user.findFirst({
        where: { id: decoded.id as string},
        select: {
          password: false,
          id: true,
          name: true,
        },
      });
      
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};