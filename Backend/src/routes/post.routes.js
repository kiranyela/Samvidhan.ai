import { Router } from "express";
import { createPost, listPosts, getPost, updateStatus, updatePost, deletePost, addAttachments, removeAttachment, getNGOFeed } from "../controllers/postCrud.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyNGOJWT, blockUnverifiedNGOIfPresent } from "../middlewares/ngoAuth.middleware.js";

const router = Router();

// Public list and view
router.get("/", blockUnverifiedNGOIfPresent, listPosts);



router.get("/ngo-feed" , verifyNGOJWT , getNGOFeed);

// Parameterized view must come after specific routes like '/ngo-feed'
router.get("/:id", blockUnverifiedNGOIfPresent, getPost);

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
