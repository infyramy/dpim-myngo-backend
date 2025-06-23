import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
// Add Node.js types for process.env
// @ts-ignore
import process from "process";

import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import profileRoutes from "./routes/profile";
import statesRoutes from "./routes/states";
import businessesRoutes from "./routes/businesses";
import lookupRoutes from "./routes/lookup";
import productsRoutes from "./routes/products";
import applicationsRoutes from "./routes/applications";
import dashboardRoutes from "./routes/dashboard";
import operatorDashboardRoutes from "./routes/operator-dashboard";
import adminDashboardRoutes from "./routes/admin-dashboard";
import membersRoutes from "./routes/members";

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin) return callback(null, true); // allow non-browser requests
      const allowed = [
        /^https?:\/\/(.*\.)?myngo\.my$/,
        /^http:\/\/localhost:3000$/,
        /^http:\/\/localhost:5173$/,
      ];
      if (allowed.some((re) => re.test(origin))) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    exposedHeaders: ["X-New-Access-Token"],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes default
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// General middleware
app.use(compression());
app.use(morgan("combined"));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/profile", profileRoutes);
app.use("/states", statesRoutes);
app.use("/businesses", businessesRoutes);
app.use("/lookup", lookupRoutes);
app.use("/products", productsRoutes);
app.use("/applications", applicationsRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/operator-dashboard", operatorDashboardRoutes);
app.use("/admin-dashboard", adminDashboardRoutes);
app.use("/members", membersRoutes);

// Health check
app.get(
  "/health",
  (_req: express.Request, res: express.Response) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
  }
);

export default app;
