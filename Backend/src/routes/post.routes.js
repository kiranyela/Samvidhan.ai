import { Router } from "express";
import { createPost, listPosts, getPost, updateStatus, updatePost, deletePost, addAttachments, removeAttachment } from "../controllers/post.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyNGOJWT, blockUnverifiedNGOIfPresent } from "../middlewares/ngoAuth.middleware.js";

const router = Router();

// Public list and view
router.get("/", blockUnverifiedNGOIfPresent, listPosts);
router.get("/:id", blockUnverifiedNGOIfPresent, getPost);

// NGO feed (requires NGO login and verification)
router.get("/ngo-feed", verifyNGOJWT, async (req, res, next) => {
  try {
    if (!req.ngo?.isVerified) {
      return res.status(403).json({ success: false, message: "NGO not verified" });
    }
    // inject ngoId into query so listPosts can filter appropriately
    req.query = {
      ...req.query,
      ngoId: String(req.ngo._id || ""),
    };
    return listPosts(req, res, next);
  } catch (e) {
    next(e);
  }
});

// Create post with up to 5 attachments under field name 'attachments'
router.post("/", upload.array("attachments", 5), createPost);
// Update status (accept/reject/pending) – NGO must be verified; inject NGO identity
router.patch("/:id/status", verifyNGOJWT, (req, res, next) => {
  if (!req.ngo?.isVerified) {
    return res.status(403).json({ success: false, message: "NGO not verified" });
  }
  // inject identity for controller to record
  req.body = {
    ...req.body,
    ngoId: String(req.ngo._id || ""),
    ngoName: req.ngo.ngoName || null,
    ngoEmail: req.ngo.email || null,
  };
  next();
}, updateStatus);
router.patch("/:id", updatePost);
router.delete("/:id", deletePost);
router.post("/:id/attachments", upload.array("attachments", 5), addAttachments);
router.delete("/:id/attachments/:publicId", removeAttachment);

export default router;
