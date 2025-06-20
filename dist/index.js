"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// const PORT = process.env.API_SERVER_PORT || process.env.BACKEND_PORT || 3002;
const PORT = process.env.PORT || 3001;
const startServer = async () => {
    try {
        // Test database connection
        await (0, database_1.testConnection)();
        // Start server
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Backend server running on port ${PORT}`);
            console.log(`📍 API available at http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map