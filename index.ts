import express from "express"
import userRoutes from "./routes/userRoutes.ts";
import perfumeRoutes from "./routes/perfumeRoutes.ts";
import paymentRoutes from "./routes/paymentRoutes.ts";
import cors from "cors";
const app = express();
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
