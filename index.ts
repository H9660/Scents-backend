import express from "express"
import dotenv from 'dotenv'
import userRoutes from "./routes/userRoutes.js";
import perfumeRoutes from "./routes/perfumeRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import cors from "cors";
const app = express();
dotenv.config()
app.use(express.json());
const allowedOrigins = process.env.NODE_ENV === 'PROD' 
    ? ['https://frontend-chi-seven-83.vercel.app/']  // Only production frontend allowed
    : ['http://localhost:3000'];          // Allow localhost in dev only

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin as string)) {
            callback(null, true);  // Allow the request
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
}));

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


