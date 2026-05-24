import mongoose, { Document, mongo, Schema } from "mongoose";

export interface IPost extends Document {
  author: mongoose.Types.ObjectId;
  title: string;
  post: string;
  like: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
}

const postSchema = new Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
    },
    post: {
      type: String,
      required: true,
    },
    like: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);
export const Post = mongoose.model<IPost>("Post", postSchema);
