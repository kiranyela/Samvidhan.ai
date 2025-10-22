import { Router } from "express";
import { listNotifications, markRead } from "../controllers/notification.controller.js";

const router = Router();

router.get("/", listNotifications);
router.patch("/:id/read", markRead);

export default router;
