"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const nocache_1 = __importDefault(require("nocache"));
const messages_router_1 = require("./messages/messages.router");
const oauth_router_1 = require("./oauth/oauth.router");
const error_middleware_1 = require("./middleware/error.middleware");
const not_found_middleware_1 = require("./middleware/not-found.middleware");
if (!(process.env.PORT &&
    process.env.CLIENT_ORIGIN_URL &&
    process.env.AUTH0_DOMAIN)) {
    throw new Error("Missing required environment variables. Check docs for more info.");
}
const PORT = parseInt(process.env.PORT, 10);
const CLIENT_ORIGIN_URL = process.env.CLIENT_ORIGIN_URL;
const app = (0, express_1.default)();
const apiRouter = express_1.default.Router();
app.use(express_1.default.json());
app.set("json spaces", 2);
app.use((0, helmet_1.default)({
    hsts: {
        maxAge: 31536000,
    },
    contentSecurityPolicy: {
        useDefaults: false,
        directives: {
            "default-src": ["'none'"],
            "frame-ancestors": ["'none'"],
        },
    },
    frameguard: {
        action: "deny",
    },
}));
app.use((req, res, next) => {
    res.contentType("application/json; charset=utf-8");
    next();
});
app.use((0, nocache_1.default)());
app.use((0, cors_1.default)({
    origin: CLIENT_ORIGIN_URL,
    methods: ["GET"],
    allowedHeaders: ["Authorization", "Content-Type"],
    maxAge: 86400,
}));
app.use("/api", apiRouter);
apiRouter.use("/messages", messages_router_1.messagesRouter);
apiRouter.use("/oauth", oauth_router_1.oauthRouter);
app.use(error_middleware_1.errorHandler);
app.use(not_found_middleware_1.notFoundHandler);
// app.listen(PORT, () => {
//   console.log(`Listening on port ${PORT}`);
// });
exports.default = app;
