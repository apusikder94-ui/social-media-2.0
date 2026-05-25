"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataBase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const DataBase = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error("MongoDb uri is not found");
    }
    try {
        mongoose_1.default.connect(uri);
        console.log("DataBase is connected successFully");
    }
    catch (error) {
        console.log("DataBase connection failed");
    }
};
exports.DataBase = DataBase;
