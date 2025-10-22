import mongoose, { Schema, model } from "mongoose";

const attachmentSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String },
    originalName: { type: String },
    mimeType: { type: String },
    size: { type: Number },
  },
  { _id: false }
);

const postSchema = new Schema(
  {
    authorType: { type: String, enum: ["user", "ngo", "guest"], default: "guest" },
    authorId: { type: Schema.Types.ObjectId, refPath: "authorTypeRef" },
    authorTypeRef: { type: String, enum: ["User", "Ngo"], default: "User" },
    contactEmail: { type: String },
    location: { type: String, default: null },
    category: { type: String },
    description: { type: String, required: true, trim: true },
    urgency: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    acceptedBy: {
      ngoId: { type: Schema.Types.ObjectId, ref: "Ngo", default: null },
      ngoName: { type: String, default: null },
      ngoEmail: { type: String, default: null },
    },
    attachments: { type: [attachmentSchema], default: [] },
  },
  { timestamps: true }
);

export const Post = model("Post", postSchema);
