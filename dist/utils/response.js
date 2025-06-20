export const sendSuccess = (res, data, message) => {
    return res.json({
        success: true,
        data,
        message,
    });
};
export const sendError = (res, status, message, errors) => {
    return res.status(status).json({
        success: false,
        message,
        errors,
    });
};
//# sourceMappingURL=response.js.map