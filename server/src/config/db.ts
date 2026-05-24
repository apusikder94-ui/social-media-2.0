import mongoose from "mongoose";

export const DataBase = async () => {
  const uri = process.env.MONGODB_URI as string;
  if (!uri) {
    throw new Error("MongoDb uri is not found");
  }
  try {
    mongoose.connect(uri);
    console.log("DataBase is connected successFully");
  } catch (error) {
    console.log("DataBase connection failed");
  }
};
