import * as dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import helmet from "helmet";
import nocache from "nocache";
import { messagesRouter } from "./messages/messages.router";
import { oauthRouter } from "./oauth/oauth.router";
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";

if (!(
  process.env.PORT &&
  process.env.CLIENT_ORIGIN_URL &&
  process.env.AUTH0_DOMAIN)) {
  throw new Error(
    "Missing required environment variables. Check docs for more info."
  );
}

if (!process.env.VERCEL_ENV) {
  console.log("VERCEL_ENV is not present. If you are developing locally without using vercel dev, you may need to define it explicitly in .env.local (remember it is overridden when vercel env pull is run)");
} else {
  console.log(`VERCEL_ENV is set to: ${process.env.VERCEL_ENV}`);
}

const PORT = parseInt(process.env.PORT, 10);
const CLIENT_ORIGIN_URL = process.env.CLIENT_ORIGIN_URL;

const app = express();
const apiRouter = express.Router();

app.use(express.json());
app.set("json spaces", 2);

app.use(
  helmet({
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
  })
);

app.use((req, res, next) => {
  res.contentType("application/json; charset=utf-8");
  next();
});
app.use(nocache());

app.use(
  cors({
    origin: CLIENT_ORIGIN_URL,
    methods: ["GET"],
    allowedHeaders: ["Authorization", "Content-Type"],
    maxAge: 86400,
  })
);

app.use("/api", apiRouter);
apiRouter.use("/messages", messagesRouter);
apiRouter.use("/oauth", oauthRouter);

app.use(errorHandler);
app.use(notFoundHandler);

// app.listen(PORT, () => {
//   console.log(`Listening on port ${PORT}`);
// });

export default app
