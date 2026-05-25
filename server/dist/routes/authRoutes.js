"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userControllers_1 = require("../controllers/userControllers");
const authMiddleware_1 = require("../middleware/authMiddleware");
const multer_1 = require("../middleware/multer");
exports.authRoutes = express_1.default.Router();
exports.authRoutes.post("/signUp", userControllers_1.signUp);
exports.authRoutes.post("/signIn", userControllers_1.signIn);
exports.authRoutes.get("/profile", authMiddleware_1.authMiddleware, userControllers_1.profile);
exports.authRoutes.put("/profile", multer_1.upload.single("profilePic"), authMiddleware_1.authMiddleware, userControllers_1.updatedProfile);
exports.authRoutes.post("/followUnFollow/:id", authMiddleware_1.authMiddleware, userControllers_1.followUnFollowing);
exports.authRoutes.post("/bookmark/:id", authMiddleware_1.authMiddleware, userControllers_1.bookmark);
exports.authRoutes.get("/suggested-users", authMiddleware_1.authMiddleware, userControllers_1.getSuggestedUsers);
exports.authRoutes.get("/otherUser/:id", userControllers_1.otherProfile);
