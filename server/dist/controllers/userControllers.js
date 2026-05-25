"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSuggestedUsers = exports.bookmark = exports.followUnFollowing = exports.updatedProfile = exports.otherProfile = exports.profile = exports.signIn = exports.signUp = void 0;
const userModels_1 = require("../models/userModels");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const postModels_1 = require("../models/postModels");
const cloudinary_1 = require("../utils/cloudinary");
const signUp = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            res.status(400).json({
                success: false,
                message: "All fields are required",
            });
            return;
        }
        const existingUser = await userModels_1.User.findOne({ email });
        if (existingUser) {
            res.status(409).json({
                success: false,
                message: "Email already exists",
            });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await userModels_1.User.create({
            name,
            email,
            password: hashedPassword,
        });
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.signUp = signUp;
const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "All fields are required",
            });
            return;
        }
        const user = await userModels_1.User.findOne({ email });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: "Invalid password",
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false, // production এ true
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
        });
        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            user,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.signIn = signIn;
const profile = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userModels_1.User.findById(userId)
            .select("-password")
            .populate({
            path: "post",
            populate: {
                path: "author",
                select: "name profilePic",
            },
        })
            .populate({
            path: "bookmark",
            populate: {
                path: "author",
                select: "name profilePic",
            },
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "UnAuthorized user",
            });
        }
        return res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
exports.profile = profile;
const otherProfile = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await userModels_1.User.findById(userId)
            .select("-password")
            .populate({
            path: "post",
            populate: {
                path: "author",
                select: "name profilePic",
            },
        })
            .populate({
            path: "bookmark",
            populate: {
                path: "author",
                select: "name profilePic",
            },
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not found",
            });
        }
        return res.status(201).json({
            success: true,
            message: "User profile received successFully",
            user,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(501).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.otherProfile = otherProfile;
const updatedProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, bio } = req.body;
        const file = req.file?.path;
        const user = await userModels_1.User.findById(userId).select("-password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "UnAuthorized user",
            });
        }
        if (name)
            user.name = name;
        if (bio)
            user.bio = bio;
        if (file) {
            const cloudImage = await (0, cloudinary_1.uploadImagesCloudinary)(file, "profileImg");
            if (cloudImage) {
                user.profilePic = cloudImage;
            }
        }
        await user.save();
        return res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
exports.updatedProfile = updatedProfile;
const followUnFollowing = async (req, res) => {
    const localUserId = req.userId;
    const otherUserId = req.params.id;
    try {
        if (!localUserId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        if (localUserId === otherUserId) {
            return res.status(400).json({
                success: false,
                message: "You cannot follow yourself",
            });
        }
        const user = await userModels_1.User.findById(localUserId);
        const otherUser = await userModels_1.User.findById(otherUserId);
        if (!user || !otherUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        // ✅ use some()
        const isFollowing = user.following.some((id) => id.toString() === otherUserId);
        if (!isFollowing) {
            user.following.push(otherUserId);
            otherUser.follower.push(localUserId);
        }
        else {
            user.following = user.following.filter((id) => id.toString() !== otherUserId);
            otherUser.follower = otherUser.follower.filter((id) => id.toString() !== localUserId);
        }
        await user.save();
        await otherUser.save();
        return res.status(200).json({
            success: true,
            message: isFollowing ? "Unfollowed" : "Followed",
            followed: !isFollowing,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
exports.followUnFollowing = followUnFollowing;
const bookmark = async (req, res) => {
    const postId = req.params.id;
    const userId = req.userId;
    try {
        const user = await userModels_1.User.findById(userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "unAuthorized user",
            });
        }
        const post = await postModels_1.Post.findById(postId);
        if (!post) {
            return res.status(401).json({
                success: false,
                message: "Post is not found",
            });
        }
        const isBookmarking = await user.bookmark.some((id) => id.toString() === postId);
        if (!isBookmarking) {
            user.bookmark.push(postId);
        }
        else {
            user.bookmark = user.bookmark.filter((id) => id.toString() !== postId);
        }
        await user.save();
        return res.status(201).json({
            success: true,
            message: isBookmarking ? "removed" : "bookmarking",
            bookmarked: isBookmarking,
        });
    }
    catch (error) { }
};
exports.bookmark = bookmark;
const getSuggestedUsers = async (req, res) => {
    try {
        const myId = req.userId;
        if (!myId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const me = await userModels_1.User.findById(myId);
        if (!me) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        // 🔥 get users except me and already followed users
        const users = await userModels_1.User.find({
            _id: {
                $ne: myId,
                $nin: me.following, // exclude already following
            },
        })
            .select("name username profile")
            .limit(10);
        return res.status(200).json({
            success: true,
            users,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
exports.getSuggestedUsers = getSuggestedUsers;
