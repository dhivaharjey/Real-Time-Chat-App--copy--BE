import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.MONGODB_CONNECTION_STRING;

const connectDb = async () => {
  try {
    const dbConnection = await mongoose.connect(connectionString);
    console.log(`MongoDB is connected: ${dbConnection.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit();
  }
};
export default connectDb;
