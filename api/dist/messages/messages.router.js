"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth0_middleware_1 = require("../middleware/auth0.middleware");
const messages_service_1 = require("./messages.service");
exports.messagesRouter = express_1.default.Router();
exports.messagesRouter.get("/public", (req, res) => {
    console.log('Public message endpoint called');
    console.log('Request headers:', req.headers);
    console.log('Authorization header:', req.headers.authorization);
    const message = (0, messages_service_1.getPublicMessage)();
    console.log('Sending public message:', message);
    res.status(200).json(message);
});
exports.messagesRouter.get("/protected", (req, res, next) => {
    console.log('Protected route accessed');
    console.log('Request headers:', req.headers);
    console.log('Authorization header:', req.headers.authorization);
    next();
}, auth0_middleware_1.validateAccessToken, (req, res) => {
    console.log('Protected message endpoint called (after validateAccessToken)');
    const message = (0, messages_service_1.getProtectedMessage)();
    console.log('Sending protected message:', message);
    res.status(200).json(message);
});
exports.messagesRouter.use((err, req, res, next) => {
    console.error('Error in messagesRouter:', err);
    res.status(500).json({ message: 'An error occurred', error: err.message });
});
exports.messagesRouter.get("/admin", auth0_middleware_1.validateAccessToken, (req, res) => {
    const message = (0, messages_service_1.getAdminMessage)();
    res.status(200).json(message);
});
