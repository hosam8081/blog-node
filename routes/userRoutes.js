import express from "express";
import {
  changeUser,
  deleteUser,
  getAllUsers,
  getUser,
} from "../controllers/userController.js";
import {
  authMiddleware,
  authorizePermissions,
} from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  authorizePermissions("can_view_users"),
  getAllUsers
);
// permission inside it "can_view_user"
router.get("/:id", authMiddleware, getUser);
router.patch(
  "/:id",
  authMiddleware,
  authorizePermissions("can_edit_user"),
  upload.single("image"),
  changeUser
);
router.delete(
  "/:id",
  authMiddleware,
  authorizePermissions("can_delete_user"),
  deleteUser
);

export default router;
