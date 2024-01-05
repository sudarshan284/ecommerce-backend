import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const Connection_URL = process.env.MongoDB_connection_string;
const DBconnection = async () => {
  mongoose.set("strictQuery", false);
  try {
    await mongoose.connect(Connection_URL as string);
    console.log("Mongodb connected.....");
  } catch (error) {
    console.log(`Error in connecting to ${error}`);
    process.exit(1);
  }
};

export default {
  connect: DBconnection,
};
