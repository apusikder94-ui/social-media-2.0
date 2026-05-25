"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImagesCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
require("dotenv").config();
// Cloudinary config
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
const uploadImagesCloudinary = async (filePath, folderName) => {
    try {
        if (!filePath)
            return null;
        const uploadResult = await cloudinary_1.v2.uploader.upload(filePath, {
            folder: folderName,
        });
        // async delete (better than sync)
        fs_1.default.unlink(filePath, (err) => {
            if (err) {
                console.log("Failed to delete local file");
            }
            else {
                console.log("Local file deleted successfully");
            }
        });
        return uploadResult.secure_url;
    }
    catch (error) {
        console.log("Cloudinary upload error:", error);
        return null;
    }
};
exports.uploadImagesCloudinary = uploadImagesCloudinary;
