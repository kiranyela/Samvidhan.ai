import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
  {
    userEmail: { type: String, index: true, required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], required: true },
    ngoName: { type: String },
    ngoEmail: { type: String },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = model("Notification", notificationSchema);
