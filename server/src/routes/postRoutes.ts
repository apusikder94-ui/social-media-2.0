import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { Post } from "../models/postModels";
import {
  createPost,
  deletePost,
  getAllPost,
  getSinglePost,
  isFollowingPost,
  likeOrUnLike,
  search,
  updatedPost,
} from "../controllers/postControllers";
import { upload } from "../middleware/multer";
export const postRoutes = express.Router();

postRoutes.post("/create", upload.single("post"), authMiddleware, createPost);
postRoutes.get("/all", getAllPost);
postRoutes.get("/singlePost/:id", getSinglePost);
postRoutes.put(
  "/updatedPost/:id",
  upload.single("post"),
  authMiddleware,
  updatedPost
);
postRoutes.delete("/deletePost/:id", authMiddleware, deletePost);
postRoutes.post("/likeOrUnLike/:id", authMiddleware, likeOrUnLike);
postRoutes.get("/search", search);
postRoutes.get("/isFollowingPost", authMiddleware, isFollowingPost);
