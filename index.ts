import express from "express"
import dotenv from 'dotenv'
import userRoutes from "./routes/userRoutes.js";
import perfumeRoutes from "./routes/perfumeRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import cors from "cors";
const app = express();
dotenv.config()
app.use(express.json());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL as string, "http://localhost:3000"]
  })
);
app.use("/api/users", userRoutes);
app.use("/api/perfume", perfumeRoutes);
app.use("/api/payment", paymentRoutes);
try {
  app.listen(5000, () => {
    console.log("Server is started.");
  });
} catch (error) {}
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

export default app
