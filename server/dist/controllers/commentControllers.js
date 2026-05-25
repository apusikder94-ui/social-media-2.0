"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updatedComment = exports.getAllComment = exports.createComment = void 0;
const userModels_1 = require("../models/userModels");
const postModels_1 = require("../models/postModels");
const commentModels_1 = require("../models/commentModels");
const createComment = async (req, res) => {
    const userId = req.userId;
    const postId = req.params.id;
    const { comment } = req.body;
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
        // ✅ create comment
        const newComment = await commentModels_1.Comment.create({
            author: user._id,
            post: post._id,
            comment,
        });
        // ✅ FIX HERE
        await postModels_1.Post.findByIdAndUpdate(postId, {
            $push: { comments: newComment._id },
        });
        return res.status(201).json({
            success: true,
            message: "Comment created successfully",
            comments: newComment,
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
exports.createComment = createComment;
const getAllComment = async (req, res) => {
    const postId = req.params.id;
    try {
        const comment = await commentModels_1.Comment.find({ post: postId }).populate({
            path: "author",
            select: "name profilePic",
        });
        if (!comment || comment.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Comment is not found",
            });
        }
        return res.status(201).json({
            success: true,
            message: "All Comment received successFully",
            comment,
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
exports.getAllComment = getAllComment;
const updatedComment = async (req, res) => {
    const userId = req.userId;
    const commentId = req.params.commentId;
    const { comment } = req.body;
    try {
        const existing = await commentModels_1.Comment.findById(commentId);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }
        // only author can update
        if (existing.author.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Only comment owner can update",
            });
        }
        existing.comment = comment || existing.comment;
        await existing.save();
        return res.status(200).json({
            success: true,
            message: "Comment updated",
            comment: existing,
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
exports.updatedComment = updatedComment;
const deleteComment = async (req, res) => {
    const userId = req.userId;
    const commentId = req.params.commentId;
    try {
        const comment = await commentModels_1.Comment.findById(commentId).populate("post");
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }
        const post = await postModels_1.Post.findById(comment.post);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }
        // check ownership
        const isCommentAuthor = comment.author.toString() === userId;
        const isPostOwner = post.author.toString() === userId;
        if (!isCommentAuthor && !isPostOwner) {
            return res.status(403).json({
                success: false,
                message: "Not allowed to delete this comment",
            });
        }
        await commentModels_1.Comment.findByIdAndDelete(commentId);
        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
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
exports.deleteComment = deleteComment;
