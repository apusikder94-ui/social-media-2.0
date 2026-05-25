"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const postControllers_1 = require("../controllers/postControllers");
const multer_1 = require("../middleware/multer");
exports.postRoutes = express_1.default.Router();
exports.postRoutes.post("/create", multer_1.upload.single("post"), authMiddleware_1.authMiddleware, postControllers_1.createPost);
exports.postRoutes.get("/all", postControllers_1.getAllPost);
exports.postRoutes.get("/singlePost/:id", postControllers_1.getSinglePost);
exports.postRoutes.put("/updatedPost/:id", multer_1.upload.single("post"), authMiddleware_1.authMiddleware, postControllers_1.updatedPost);
exports.postRoutes.delete("/deletePost/:id", authMiddleware_1.authMiddleware, postControllers_1.deletePost);
exports.postRoutes.post("/likeOrUnLike/:id", authMiddleware_1.authMiddleware, postControllers_1.likeOrUnLike);
exports.postRoutes.get("/search", postControllers_1.search);
exports.postRoutes.get("/isFollowingPost", authMiddleware_1.authMiddleware, postControllers_1.isFollowingPost);
