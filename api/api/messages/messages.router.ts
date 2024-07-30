import express, { Request, Response, NextFunction } from "express";
import { validateAccessToken } from "../middleware/auth0.middleware";
import {
  getAdminMessage,
  getProtectedMessage,
  getPublicMessage,
} from "./messages.service";

export const messagesRouter = express.Router();

messagesRouter.get("/public", (req, res) => {
  console.log('Public message endpoint called');
  console.log('Request headers:', req.headers);
  console.log('Authorization header:', req.headers.authorization);
  
  const message = getPublicMessage();

  console.log('Sending public message:', message);
  res.status(200).json(message);
});

messagesRouter.get("/protected", (req, res, next) => {
  console.log('Protected route accessed');
  console.log('Request headers:', req.headers);
  console.log('Authorization header:', req.headers.authorization);
  next();
}, validateAccessToken, (req, res) => {
  console.log('Protected message endpoint called (after validateAccessToken)');
  
  const message = getProtectedMessage();

  console.log('Sending protected message:', message);
  res.status(200).json(message);
});

messagesRouter.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error in messagesRouter:', err);
  res.status(500).json({ message: 'An error occurred', error: err.message });
});

messagesRouter.get("/admin", validateAccessToken, (req, res) => {
  const message = getAdminMessage();

  res.status(200).json(message);
});
