"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, data, message) => {
    return res.json({
        success: true,
        data,
        message,
    });
};
exports.sendSuccess = sendSuccess;
const sendError = (res, status, message, errors) => {
    return res.status(status).json({
        success: false,
        message,
        errors,
    });
};
exports.sendError = sendError;
//# sourceMappingURL=response.js.map