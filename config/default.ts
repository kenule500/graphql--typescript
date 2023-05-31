import { config } from "dotenv";

config(); // Load environment variables from .env file in the same directory as this file

// Load environment variables based on the current environment
if (process.env.NODE_ENV === "production") {
  config({ path: ".env.production" });
} else if (process.env.NODE_ENV === "test") {
  config({ path: ".env.test" });
} else {
  config({ path: ".env.development" });
}
// Retrieve the environment variables
export const { DB_HOST, DB_DATABASE, DB_PORT, DB_USERNAME, DB_PASSWORD, JWTSECRET } = process.env;
