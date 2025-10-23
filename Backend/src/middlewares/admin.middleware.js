import { ApiError } from "../utils/ApiError.js";

export const isAdmin = (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }
    // Allow admin by role OR email allowlist
    const allowList = (process.env.ADMIN_EMAILS || "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
    const byRole = user.role === "admin";
    const byEmail = allowList.includes(String(user.email || "").toLowerCase());
    if (!byRole && !byEmail) {
      throw new ApiError(403, "Forbidden: admin only");
    }
    next();
  } catch (e) {
    next(e);
  }
};
