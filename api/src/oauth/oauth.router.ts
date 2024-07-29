import express from "express";
import { authProxy, tokenProxy } from "./oauth.service";

export const oauthRouter = express.Router();

oauthRouter.get("/auth", authProxy);
oauthRouter.post("/token", tokenProxy);
