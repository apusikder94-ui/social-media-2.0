"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const commentControllers_1 = require("../controllers/commentControllers");
exports.commentRoutes = express_1.default.Router();
// Create comment
exports.commentRoutes.post("/:id", authMiddleware_1.authMiddleware, commentControllers_1.createComment);
// Get all comments of a post
exports.commentRoutes.get("/:id", commentControllers_1.getAllComment);
// Update comment
exports.commentRoutes.put("/:commentId", authMiddleware_1.authMiddleware, commentControllers_1.updatedComment);
// Delete comment (author OR post owner)
exports.commentRoutes.delete("/:commentId", authMiddleware_1.authMiddleware, commentControllers_1.deleteComment);
