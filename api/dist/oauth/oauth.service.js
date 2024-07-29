"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenProxy = exports.authProxy = void 0;
const axios_1 = __importDefault(require("axios"));
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE || ''; // Ensure it's always a string
const authProxy = (req, res) => {
    console.log('authProxy - Incoming request query:', req.query);
    if (AUTH0_AUDIENCE) {
        req.query.audience = AUTH0_AUDIENCE; // Add audience to the query parameters if defined
    }
    const auth0AuthorizeUrl = `https://${AUTH0_DOMAIN}/authorize?${new URLSearchParams(req.query)}`;
    console.log('authProxy - Redirecting to:', auth0AuthorizeUrl);
    res.redirect(auth0AuthorizeUrl);
};
exports.authProxy = authProxy;
const tokenProxy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let rawBody = '';
    req.on('data', chunk => {
        rawBody += chunk.toString();
    });
    req.on('end', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            console.log('tokenProxy - Raw request body:', rawBody);
            // Parse the raw body
            const parsedBody = new URLSearchParams(rawBody);
            const bodyObject = Object.fromEntries(parsedBody);
            // Add the audience parameter if defined
            if (AUTH0_AUDIENCE) {
                bodyObject.audience = AUTH0_AUDIENCE;
            }
            console.log('tokenProxy - Parsed request body with audience:', bodyObject);
            console.log('tokenProxy - Incoming request headers:', req.headers);
            if (!rawBody) {
                console.error('tokenProxy - Request body is empty');
                return res.status(400).json({ message: "Request body is empty" });
            }
            const requiredFields = ['grant_type', 'client_id', 'client_secret', 'code', 'redirect_uri'];
            if (AUTH0_AUDIENCE) {
                requiredFields.push('audience'); // Add audience to required fields if defined
            }
            const missingFields = requiredFields.filter(field => !(field in bodyObject));
            if (missingFields.length > 0) {
                console.error(`tokenProxy - Missing required fields: ${missingFields.join(', ')}`);
                return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
            }
            const newBody = new URLSearchParams(bodyObject).toString(); // Rebuild the body with the audience
            const auth0Response = yield axios_1.default.post(`https://${AUTH0_DOMAIN}/oauth/token`, newBody, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            console.log('tokenProxy - Auth0 response status:', auth0Response.status);
            console.log('tokenProxy - Auth0 response headers:', auth0Response.headers);
            console.log('tokenProxy - Auth0 response data:', auth0Response.data);
            res.setHeader('Content-Type', 'application/json');
            res.status(auth0Response.status).send(JSON.stringify(auth0Response.data));
            console.log('tokenProxy - Response sent to client');
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                console.error(`tokenProxy - Failed to fetch token from Auth0, status code: ${(_a = error.response) === null || _a === void 0 ? void 0 : _a.status}, ` +
                    `request data: ${JSON.stringify(req.body)}, error: ${(_b = error.response) === null || _b === void 0 ? void 0 : _b.data}`);
                res.status(((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) || 500).json({
                    message: "Failed to exchange token with Auth0.",
                    error_details: (_d = error.response) === null || _d === void 0 ? void 0 : _d.data,
                    form_data: req.body
                });
            }
            else {
                console.error("tokenProxy - Unexpected error:", error);
                res.status(500).json({ message: "An unexpected error occurred" });
            }
        }
    }));
});
exports.tokenProxy = tokenProxy;
