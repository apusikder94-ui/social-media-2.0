"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFollowingPost = exports.search = exports.likeOrUnLike = exports.deletePost = exports.updatedPost = exports.getSinglePost = exports.getAllPost = exports.createPost = void 0;
const userModels_1 = require("../models/userModels");
const postModels_1 = require("../models/postModels");
const cloudinary_1 = require("../utils/cloudinary");
const createPost = async (req, res) => {
    const userId = req.userId;
    const { title } = req.body;
    const filePath = req.file?.path;
    try {
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const user = await userModels_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        let imageUrl = "";
        if (filePath) {
            const uploadedUrl = await (0, cloudinary_1.uploadImagesCloudinary)(filePath, "post");
            if (uploadedUrl) {
                imageUrl = uploadedUrl;
            }
        }
        const postCreate = await postModels_1.Post.create({
            author: user._id,
            title,
            post: imageUrl,
        });
        await user.post.push(postCreate._id);
        await user.save();
        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            post: postCreate,
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
exports.createPost = createPost;
const getAllPost = async (req, res) => {
    try {
        const post = await postModels_1.Post.find()
            .populate({ path: "author", select: "name profilePic" })
            .sort({ createdAt: -1 });
        if (!post || post.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Post is not found",
            });
        }
        return res.status(201).json({
            success: true,
            message: "All post received successFully",
            post,
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
exports.getAllPost = getAllPost;
const getSinglePost = async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await postModels_1.Post.findById(postId).populate({
            path: "author",
            select: "name",
        });
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post is not found",
            });
        }
        return res.status(201).json({
            success: false,
            message: "All post received successFully",
            post,
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
exports.getSinglePost = getSinglePost;
const updatedPost = async (req, res) => {
    const userId = req.userId;
    const postId = req.params.id;
    const { title } = req.body;
    const filePath = req.file?.path;
    try {
        const user = await userModels_1.User.findById(userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "UnAuthorized User",
            });
        }
        const post = await postModels_1.Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post is not found",
            });
        }
        if (user._id.toString() !== post.author._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "author can updated images",
            });
        }
        if (title)
            post.title = title;
        if (filePath) {
            const cloudImg = await (0, cloudinary_1.uploadImagesCloudinary)(filePath, "post");
            if (cloudImg) {
                post.post = cloudImg;
            }
        }
        await post.save();
        return res.status(201).json({
            success: true,
            message: "Post updated successFully",
            post,
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
exports.updatedPost = updatedPost;
const deletePost = async (req, res) => {
    const userId = req.userId;
    const postId = req.params.id;
    try {
        const user = await userModels_1.User.findById(userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "UnAuthorized User",
            });
        }
        const post = await postModels_1.Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post is not found",
            });
        }
        const postDelete = await postModels_1.Post.findByIdAndDelete(postId);
        return res.status(201).json({
            success: false,
            message: "Post deleted successFully",
            postDelete,
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
exports.deletePost = deletePost;
const likeOrUnLike = async (req, res) => {
    const userId = req.userId;
    const postId = req.params.id;
    try {
        const post = await postModels_1.Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }
        const isLiking = post.like.some((id) => id.toString() === userId);
        if (!isLiking) {
            post.like.push(userId);
        }
        else {
            post.like = post.like.filter((id) => id.toString() !== userId);
        }
        await post.save();
        return res.status(200).json({
            success: true,
            message: isLiking ? "Unliked" : "Liked",
            liked: !isLiking,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.likeOrUnLike = likeOrUnLike;
const search = async (req, res) => {
    const keyword = req.query.i;
    try {
        if (!keyword || typeof keyword !== "string") {
            return res.json({ post: [], user: [] });
        }
        const user = await userModels_1.User.find({
            name: {
                $regex: keyword,
                $options: "i",
            },
        });
        const post = await postModels_1.Post.find({
            title: {
                $regex: keyword,
                $options: "i",
            },
        }).populate({ path: "author", select: "name profilePic" });
        return res.status(200).json({
            success: true,
            message: "Search successfully",
            user,
            post,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.search = search;
const isFollowingPost = async (req, res) => {
    const userId = req?.userId;
    try {
        const user = await userModels_1.User.findById(userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }
        // 👇 list of users current user follows
        const followingIds = user.following;
        // 👇 get posts from those users
        const posts = await postModels_1.Post.find({
            author: { $in: followingIds },
        })
            .populate("author")
            .sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            posts,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};
exports.isFollowingPost = isFollowingPost;
