import dotenv from "dotenv";
import csrf from "csurf";
dotenv.config();
import express, { Request, Response, NextFunction } from "express";
import userRoutes from "./routes/userRoutes.js";
import perfumeRoutes from "./routes/perfumeRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import mailRoutes from "./routes/mailRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
const app = express();
app.use(cookieParser());
const csrfProtection = csrf({
  cookie: {
    httpOnly: false, // 🧠 Key point: allow JS to read it
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },
});

app.use(
  cors({
    origin: [
      "https://frontend-chi-seven-83.vercel.app",
      process.env.FRONTEND_URL || "",
    ],
    credentials: true,
  })
);

// app.use((req, res, next) => {
//   if (req.method === "GET") return next(); // Skip CSRF for GET
//   csrfProtection(req as any, res as any, (err) => {
//     if (err) return next(err);
//     res.cookie("XSRF-TOKEN", req.csrfToken(), {
//       httpOnly: false,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//     });
//     next();
//   });
// });

app.use(express.json());
app.get("/api/csrf-token", (req: Request, res: Response) => {
  res.json({ csrfToken: req.csrfToken() });
});
app.use("/api/users", userRoutes);
app.use("/api/perfume", perfumeRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/sendmail", mailRoutes);
app.use(errorMiddleware);
app.listen(5000, () => {
  console.log("Server is started.");
});
export default app;
