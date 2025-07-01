import mongoose, { ConnectOptions } from "mongoose";
import config from "./db.config";
import Logger from "../utils/logger";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

const connectToDatabase = async (retryCount = 0): Promise<void> => {
  const options: ConnectOptions = {};
  const uri = config.local.localUrlDatabase;
 
  mongoose.set("strictQuery", true);

  try {
    const db = await mongoose.connect(uri, options);
    Logger.info(`Connected to MongoDB: ${db.connection.name}`);
  } catch (error: any) {
    Logger.error(`Failed to connect to MongoDB (attempt ${retryCount + 1}): ${error.message}`);

    if (retryCount < MAX_RETRIES) {
      Logger.info(`Retrying in ${RETRY_DELAY_MS / 1000}s...`);
      setTimeout(() => connectToDatabase(retryCount + 1), RETRY_DELAY_MS);
    } else {
      Logger.error("Exceeded max retry attempts. Exiting process.");
      process.exit(1)
    }
  }
};

export default connectToDatabase;
