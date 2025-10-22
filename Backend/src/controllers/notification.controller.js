import { Notification } from "../models/notification.model.js";

export const listNotifications = async (req, res, next) => {
  try {
    const userEmail = (req.query.userEmail || "").toLowerCase();
    if (!userEmail) return res.status(400).json({ success: false, message: "userEmail is required" });

    const { limit = 50, page = 1 } = req.query;
    const l = Math.min(parseInt(limit, 10) || 50, 100);
    const p = Math.max(parseInt(page, 10) || 1, 1);

    const notifications = await Notification.find({ userEmail })
      .sort({ createdAt: -1 })
      .skip((p - 1) * l)
      .limit(l)
      .lean();

    return res.json({ success: true, data: notifications, pagination: { page: p, limit: l } });
  } catch (err) {
    next(err);
  }
};

export const markRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const n = await Notification.findByIdAndUpdate(id, { $set: { read: true } }, { new: true });
    if (!n) return res.status(404).json({ success: false, message: "Not found" });
    return res.json({ success: true, data: n });
  } catch (err) {
    next(err);
  }
};
