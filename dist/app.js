"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const profile_1 = __importDefault(require("./routes/profile"));
const states_1 = __importDefault(require("./routes/states"));
const businesses_1 = __importDefault(require("./routes/businesses"));
const lookup_1 = __importDefault(require("./routes/lookup"));
const products_1 = __importDefault(require("./routes/products"));
const applications_1 = __importDefault(require("./routes/applications"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const operator_dashboard_1 = __importDefault(require("./routes/operator-dashboard"));
const admin_dashboard_1 = __importDefault(require("./routes/admin-dashboard"));
const members_1 = __importDefault(require("./routes/members"));
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
    exposedHeaders: ["X-New-Access-Token"], // Expose our custom header to client
}));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);
// General middleware
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)("combined"));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
// API Routes
app.use("/auth", auth_1.default);
app.use("/users", users_1.default);
app.use("/profile", profile_1.default);
app.use("/states", states_1.default);
app.use("/businesses", businesses_1.default);
app.use("/lookup", lookup_1.default);
app.use("/products", products_1.default);
app.use("/applications", applications_1.default);
app.use("/dashboard", dashboard_1.default);
app.use("/operator-dashboard", operator_dashboard_1.default);
app.use("/admin-dashboard", admin_dashboard_1.default);
app.use("/members", members_1.default);
// Health check
app.get("/health", (_req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});
exports.default = app;
//# sourceMappingURL=app.js.map