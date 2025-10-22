import { Post } from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Notification } from "../models/notification.model.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";

export const createPost = async (req, res, next) => {
  try {
    const { description, category, contactEmail, location, urgency } = req.body;
    if (!description || !description.trim()) {
      return res.status(400).json({ success: false, message: "Description is required" });
    }

    // Determine author from auth middlewares (optional)
    let authorType = "guest";
    let authorId = null;
    let authorTypeRef = "User";

    if (req.user) {
      authorType = "user";
      authorId = req.user._id;
      authorTypeRef = "User";
    }
    if (req.ngo) {
      authorType = "ngo";
      authorId = req.ngo._id;
      authorTypeRef = "Ngo";
    }

    // very simple heuristics for auto-categorization and urgency
    const inferCategory = (text) => {
      const t = text.toLowerCase();
      if (/harass|assault|violence|threat/.test(t)) return "Criminal Law";
      if (/salary|wage|unpaid|termination|workplace|employ/.test(t)) return "Employment Rights";
      if (/property|land|tenancy|rent|evict/.test(t)) return "Property & Tenancy";
      if (/marriage|divorce|custody|domestic/.test(t)) return "Family Law";
      if (/cyber|online|fraud|phishing/.test(t)) return "Cyber Crime";
      return "General";
    };

    const inferUrgency = (text) => {
      const t = text.toLowerCase();
      if (/life\s*threat|immediate|urgent|right\s*now|danger|violence/.test(t)) return "high";
      if (/soon|asap|quick|priority/.test(t)) return "medium";
      return "medium";
    };

    const files = req.files || [];
    const attachments = [];
    for (const f of files) {
      const uploaded = await uploadOnCloudinary(f.path);
      if (uploaded) {
        attachments.push({
          url: uploaded.secure_url,
          publicId: uploaded.public_id,
          originalName: f.originalname,
          mimeType: f.mimetype,
          size: f.size,
        });
      }
    }

    const post = await Post.create({
      authorType,
      authorId,
      authorTypeRef,
      category: category || inferCategory(description),
      urgency: urgency || inferUrgency(description),
      contactEmail: contactEmail || (req.user?.email || req.ngo?.email) || null,
      location: location || null,
      description: description.trim(),
      attachments,
    });

    return res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

export const listPosts = async (req, res, next) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const l = Math.min(parseInt(limit, 10) || 20, 100);
    const p = Math.max(parseInt(page, 10) || 1, 1);

    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip((p - 1) * l)
      .limit(l)
      .lean();

    return res.json({ success: true, data: posts, pagination: { page: p, limit: l } });
  } catch (err) {
    next(err);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ success: false, message: "Not found" });
    return res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { description, category, location } = req.body;
    const update = {};
    if (typeof description === "string" && description.trim()) update.description = description.trim();
    if (typeof category === "string") update.category = category;
    if (typeof location === "string") update.location = location;

    const post = await Post.findByIdAndUpdate(id, { $set: update }, { new: true });
    if (!post) return res.status(404).json({ success: false, message: "Not found" });
    return res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    if (!post) return res.status(404).json({ success: false, message: "Not found" });
    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const addAttachments = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ success: false, message: "Not found" });

    const files = req.files || [];
    const newAttachments = [];
    for (const f of files) {
      const uploaded = await uploadOnCloudinary(f.path);
      if (uploaded) {
        newAttachments.push({
          url: uploaded.secure_url,
          publicId: uploaded.public_id,
          originalName: f.originalname,
          mimeType: f.mimetype,
          size: f.size,
        });
      }
    }

    post.attachments.push(...newAttachments);
    await post.save();
    return res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

export const removeAttachment = async (req, res, next) => {
  try {
    const { id, publicId } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ success: false, message: "Not found" });
    const before = post.attachments.length;
    post.attachments = post.attachments.filter((a) => a.publicId !== publicId);
    const removed = before !== post.attachments.length;
    if (removed) {
      await deleteFromCloudinary(publicId);
      await post.save();
    }
    return res.json({ success: true, data: post, removed });
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, ngoName, ngoEmail, ngoId } = req.body;
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const update = { status };
    if (status === 'accepted') {
      update.acceptedBy = { ngoId: ngoId || null, ngoName: ngoName || null, ngoEmail: ngoEmail || null };
    }
    if (status === 'pending' || status === 'rejected') {
      update.acceptedBy = { ngoId: null, ngoName: null, ngoEmail: null };
    }
    const post = await Post.findByIdAndUpdate(id, { $set: update }, { new: true });
    if (!post) return res.status(404).json({ success: false, message: 'Not found' });
    // Create a notification to the user who posted (if contactEmail is present)
    if (post.contactEmail) {
      const msg = status === 'accepted'
        ? `${ngoName || 'An NGO'} has accepted your post.`
        : status === 'rejected'
        ? `${ngoName || 'An NGO'} has rejected your post.`
        : `Your post status is now pending.`;
      try {
        await Notification.create({
          userEmail: (post.contactEmail || '').toLowerCase(),
          postId: post._id,
          status,
          ngoName: ngoName || null,
          ngoEmail: ngoEmail || null,
          message: msg,
        });
      } catch (e) {
        // non-fatal
      }
    }
    return res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};
