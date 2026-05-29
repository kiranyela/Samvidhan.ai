import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Post } from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Helpers
const toObjectId = (id) => {
  try { return new mongoose.Types.ObjectId(String(id)); } catch { return null; }
};

const fileToAttachment = async (file) => {
  const upload = await uploadOnCloudinary(file.path);
  if (!upload) throw new ApiError(500, "Failed to upload attachment");
  return {
    url: upload.secure_url,
    publicId: upload.public_id || undefined,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
  };
};

// Create a new post (supports attachments via multer array("attachments"))
const createPost = asyncHandler(async (req, res) => {
  const { authorType, authorId, contactEmail, location, category, description, urgency } = req.body;
  if (!description || String(description).trim() === "") throw new ApiError(400, "Description is required");

  let attachments = [];
  if (Array.isArray(req.files) && req.files.length > 0) {
    attachments = await Promise.all(req.files.map(fileToAttachment));
  }

  const doc = await Post.create({
    authorType: authorType || "guest",
    authorId: authorId || null,
    authorTypeRef: authorType === "ngo" ? "Ngo" : "User",
    contactEmail: contactEmail || null,
    location: location || null,
    category: category || null,
    description: String(description),
    urgency: ["low", "medium", "high"].includes(String(urgency)) ? urgency : "medium",
    attachments,
  });

  return res.status(201).json(new ApiResponse(201, "Post created", doc));
});

// List posts; if req.query.ngoId provided (from /ngo-feed), apply NGO-specific visibility rules
const listPosts = asyncHandler(async (req, res) => {
  const { ngoId } = req.query || {};
  const filters = {};

  if (ngoId) {
    const oid = toObjectId(ngoId);
    if (!oid) throw new ApiError(400, "Invalid ngoId");
    // Show posts that are pending OR accepted by this NGO
    // Exclude posts that were explicitly rejected by this NGO
    filters.$and = [
      {
        $or: [
          { status: "pending" },
          { $and: [ { status: "accepted" }, { "acceptedBy.ngoId": oid } ] },
        ],
      },
      {
        $or: [
          { "rejectedBy.ngoId": { $ne: oid } },
          { rejectedBy: { $exists: false } },
          { rejectedBy: { $size: 0 } },
        ],
      },
    ];
  }

  const results = await Post.find(filters).sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, "Posts fetched", results));
});

// Get single post
const getPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) throw new ApiError(404, "Post not found");
  return res.status(200).json(new ApiResponse(200, "Post fetched", post));
});

// Update status by NGO (accept/reject/pending)
const updateStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, ngoId, ngoName, ngoEmail } = req.body || {};

  if (!status || !["pending", "accepted", "rejected"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }
  const oid = toObjectId(ngoId);
  if (!oid) throw new ApiError(400, "Invalid NGO identity");

  const post = await Post.findById(id);
  if (!post) throw new ApiError(404, "Post not found");

  if (status === "accepted") {
    post.status = "accepted";
    post.acceptedBy = { ngoId: oid, ngoName: ngoName || null, ngoEmail: ngoEmail || null };
    // remove any previous reject entry by this NGO
    post.rejectedBy = (post.rejectedBy || []).filter((r) => String(r.ngoId) !== String(oid));
  } else if (status === "rejected") {
    post.status = "rejected";
    post.acceptedBy = { ngoId: null, ngoName: null, ngoEmail: null };
    const already = (post.rejectedBy || []).some((r) => String(r.ngoId) === String(oid));
    if (!already) {
      post.rejectedBy.push({ ngoId: oid, ngoName: ngoName || null, ngoEmail: ngoEmail || null, at: new Date() });
    }
  } else if (status === "pending") {
    post.status = "pending";
    // clear acceptance or rejection by this NGO so it shows up again
    if (post.acceptedBy?.ngoId && String(post.acceptedBy.ngoId) === String(oid)) {
      post.acceptedBy = { ngoId: null, ngoName: null, ngoEmail: null };
    }
    post.rejectedBy = (post.rejectedBy || []).filter((r) => String(r.ngoId) !== String(oid));
  }

  await post.save();
  return res.status(200).json(new ApiResponse(200, "Status updated", post));
});

// Patch basic fields
const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const allowed = ["description", "category", "urgency", "location"]; 
  const update = {};
  for (const k of allowed) if (k in req.body) update[k] = req.body[k];
  const post = await Post.findByIdAndUpdate(id, update, { new: true });
  if (!post) throw new ApiError(404, "Post not found");
  return res.status(200).json(new ApiResponse(200, "Post updated", post));
});

const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findByIdAndDelete(id);
  if (!post) throw new ApiError(404, "Post not found");
  return res.status(200).json(new ApiResponse(200, "Post deleted", post));
});

const addAttachments = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) throw new ApiError(404, "Post not found");

  let attachments = [];
  if (Array.isArray(req.files) && req.files.length > 0) {
    attachments = await Promise.all(req.files.map(fileToAttachment));
  }
  post.attachments.push(...attachments);
  await post.save();

  return res.status(200).json(new ApiResponse(200, "Attachments added", post));
});

const removeAttachment = asyncHandler(async (req, res) => {
  const { id, publicId } = req.params;
  const post = await Post.findById(id);
  if (!post) throw new ApiError(404, "Post not found");
  post.attachments = (post.attachments || []).filter((a) => a.publicId !== publicId);
  await post.save();
  return res.status(200).json(new ApiResponse(200, "Attachment removed", post));
});

const getNGOFeed = async(req , res) => {
  try {
    // Must be authenticated and verified NGO (middleware sets req.ngo)
    if (!req.ngo?.isVerified) {
      return res.status(403).json({ success: false, message: "NGO not verified" });
    }

    const oid = toObjectId(req.ngo._id);
    if (!oid) throw new ApiError(400, "Invalid NGO identity");

    const notRejectedByThisNgo = {
      $or: [
        { "rejectedBy.ngoId": { $ne: oid } },
        { rejectedBy: { $exists: false } },
        { rejectedBy: { $size: 0 } },
      ],
    };

    const results = await Post.find({
      $or: [
        { $and: [ { status: "pending" }, notRejectedByThisNgo ] },
        { $and: [ { status: "accepted" }, { "acceptedBy.ngoId": oid } ] },
        { $and: [ { status: "rejected" }, { "rejectedBy.ngoId": oid } ] },
      ],
    }).sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, "NGO feed fetched", results));
  }
  catch(err) {
    console.log("Error whilin getNGOFeed  " , err );
    return res.status(500).json({
      message : "Internal server error " + err.message,
    })
  }
}

export {
  createPost,
  listPosts,
  getPost,
  updateStatus,
  updatePost,
  deletePost,
  addAttachments,
  removeAttachment,
  getNGOFeed,
};
