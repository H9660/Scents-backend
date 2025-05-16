import dotenv from "dotenv";
dotenv.config();
import express from "express";
import userRoutes from "./routes/userRoutes.js";
import perfumeRoutes from "./routes/perfumeRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
const app = express();
app.use(
  cors({
    origin: [
      "https://frontend-chi-seven-83.vercel.app",
      process.env.FRONTEND_URL || "",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/perfume", perfumeRoutes);
app.use("/api/payment", paymentRoutes);
app.use(errorMiddleware);
app.listen(5000, () => {
  console.log("Server is started.");
});
export default app;
