import * as dotenv from "dotenv";
import { auth, UnauthorizedError } from "express-oauth2-jwt-bearer";
import { Request, Response, NextFunction } from "express";

dotenv.config({ path: '.env.local' });

export const validateAccessToken = auth({
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  audience: process.env.AUTH0_AUDIENCE,
});