import * as dotenv from "dotenv";
import app from "./index"
dotenv.config();

if (!(
  process.env.PORT
)) {
  throw new Error(
    "Missing required environment variables. Check docs for more info."
  );
}

const PORT = parseInt(process.env.PORT, 10);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });