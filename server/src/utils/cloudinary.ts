import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
require("dotenv").config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME as string,
  api_key: process.env.API_KEY as string,
  api_secret: process.env.API_SECRET as string,
});

export const uploadImagesCloudinary = async (
  filePath: string,
  folderName: string
): Promise<string | null> => {
  try {
    if (!filePath) return null;

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: folderName,
    });

    // async delete (better than sync)
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log("Failed to delete local file");
      } else {
        console.log("Local file deleted successfully");
      }
    });

    return uploadResult.secure_url;
  } catch (error) {
    console.log("Cloudinary upload error:", error);
    return null;
  }
};
