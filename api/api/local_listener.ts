import * as dotenv from "dotenv";
import app from "./index"
dotenv.config();

if (!(
  process.env.PORT
)) {
  throw new Error(
    "Missing PORT environment variable."
  );
}

const PORT = parseInt(process.env.PORT, 10);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });