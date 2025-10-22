import { Router } from "express";
import { createPost, listPosts, getPost, updateStatus, updatePost, deletePost, addAttachments, removeAttachment } from "../controllers/post.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Public list and view
router.get("/", listPosts);
router.get("/:id", getPost);

// Create post with up to 5 attachments under field name 'attachments'
router.post("/", upload.array("attachments", 5), createPost);
// Update status (accept/reject/pending)
router.patch("/:id/status", updateStatus);
router.patch("/:id", updatePost);
router.delete("/:id", deletePost);
router.post("/:id/attachments", upload.array("attachments", 5), addAttachments);
router.delete("/:id/attachments/:publicId", removeAttachment);

export default router;
