import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  createComment,
  getAllComment,
  updatedComment,
  deleteComment,
} from "../controllers/commentControllers";

export const commentRoutes = express.Router();

// Create comment
commentRoutes.post("/:id", authMiddleware, createComment);

// Get all comments of a post
commentRoutes.get("/:id", getAllComment);

// Update comment
commentRoutes.put("/:commentId", authMiddleware, updatedComment);

// Delete comment (author OR post owner)
commentRoutes.delete("/:commentId", authMiddleware, deleteComment);
