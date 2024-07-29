"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauthRouter = void 0;
const express_1 = __importDefault(require("express"));
const oauth_service_1 = require("./oauth.service");
exports.oauthRouter = express_1.default.Router();
exports.oauthRouter.get("/auth", oauth_service_1.authProxy);
exports.oauthRouter.post("/token", oauth_service_1.tokenProxy);
