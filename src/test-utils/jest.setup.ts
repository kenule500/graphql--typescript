import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });
import { AppDataSource } from "../data-source";

beforeAll(async () => {
  await AppDataSource.initialize(); // Ensure the database connection is established
  await AppDataSource.dropDatabase(); // Drop the database
  await AppDataSource.synchronize(); // Synchronize the database schema
});

afterAll(async () => {
  await AppDataSource.destroy(); // Close the connection
});
