import express from "express"
import dotenv from 'dotenv'
import userRoutes from "./routes/userRoutes.js";
import perfumeRoutes from "./routes/perfumeRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import cors from "cors";
const app = express();
dotenv.config()
const allowedOrigins = [
  process.env.FRONTEND_URL,  // Stable frontend URL
  /^https:\/\/your-frontend-domain.*\.vercel\.app$/ // Dynamic preview URLs
];

app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.get('origin')??";

  if (origin && allowedOrigins.some((o) => 
    typeof o === 'string' ? o === origin : o.test(origin)
  )) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }

  next();
});

app.use(express.json());
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


