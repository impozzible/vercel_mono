import { Request, Response } from "express";
import axios from "axios";

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_AUDIENCE: string = process.env.AUTH0_AUDIENCE || ''; // Ensure it's always a string

export const authProxy = (req: Request, res: Response) => {
  console.log('authProxy - Incoming request query:', req.query);
  if (AUTH0_AUDIENCE) {
    req.query.audience = AUTH0_AUDIENCE; // Add audience to the query parameters if defined
  }
  const auth0AuthorizeUrl = `https://${AUTH0_DOMAIN}/authorize?${new URLSearchParams(req.query as Record<string, string>)}`;
  console.log('authProxy - Redirecting to:', auth0AuthorizeUrl);
  res.redirect(auth0AuthorizeUrl);
};

export const tokenProxy = async (req: Request, res: Response) => {
  let rawBody = '';
  req.on('data', chunk => {
    rawBody += chunk.toString();
  });

  req.on('end', async () => {
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

      const auth0Response = await axios.post(
        `https://${AUTH0_DOMAIN}/oauth/token`,
        newBody,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      console.log('tokenProxy - Auth0 response status:', auth0Response.status);
      console.log('tokenProxy - Auth0 response headers:', auth0Response.headers);
      console.log('tokenProxy - Auth0 response data:', auth0Response.data);
      
      res.setHeader('Content-Type', 'application/json');
      res.status(auth0Response.status).send(JSON.stringify(auth0Response.data));
      console.log('tokenProxy - Response sent to client');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          `tokenProxy - Failed to fetch token from Auth0, status code: ${error.response?.status}, ` +
          `request data: ${JSON.stringify(req.body)}, error: ${error.response?.data}`
        );
        res.status(error.response?.status || 500).json({
          message: "Failed to exchange token with Auth0.",
          error_details: error.response?.data,
          form_data: req.body
        });
      } else {
        console.error("tokenProxy - Unexpected error:", error);
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  });
};
