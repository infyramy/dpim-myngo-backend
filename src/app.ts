import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

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

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : undefined; // fallback to custom function for *.kipidap.my
console.log("ALLOWED_ORIGINS:", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow non-browser requests
      if (allowedOrigins && allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // Allow any subdomain of kipidap.my
      const kipidapRegex = /^https?:\/\/[a-zA-Z0-9.-]*kipidap\.my$/;
      if (kipidapRegex.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    exposedHeaders: ["X-New-Access-Token"], // Expose our custom header to client
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
app.get("/health", (_req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

export default app;
