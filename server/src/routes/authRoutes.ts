import express from "express";
import {
  bookmark,
  followUnFollowing,
  getSuggestedUsers,
  logout,
  otherProfile,
  profile,
  signIn,
  signUp,
  updatedProfile,
} from "../controllers/userControllers";
import { authMiddleware } from "../middleware/authMiddleware";
import { upload } from "../middleware/multer";
export const authRoutes =  express.Router();

authRoutes.post("/signUp", signUp);
authRoutes.post("/signIn", signIn);
authRoutes.post("/logout",authMiddleware, logout);
authRoutes.get("/profile", authMiddleware, profile);
authRoutes.put("/profile",upload.single("profilePic"), authMiddleware, updatedProfile);
authRoutes.post("/followUnFollow/:id", authMiddleware, followUnFollowing);
authRoutes.post("/bookmark/:id", authMiddleware, bookmark);
authRoutes.get("/suggested-users", authMiddleware, getSuggestedUsers);
authRoutes.get("/otherUser/:id", otherProfile);
