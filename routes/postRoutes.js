import express from "express";
import {
  getAllBlogs,
  postCreate,
  getBlog,
  deleteBlog,
  changeBlog,
} from "../controllers/postController.js";
import {
  authMiddleware,
  authorizePermissions,
} from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js"; // Import Multer middleware

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  (req, res, next) => {
    if (req.user.permissions.includes("can_post_blog", "test")) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized to access this route" });
    }
  },
  upload.single("image"),
  postCreate
);
router.get("/", getAllBlogs);
router.get("/:slug", getBlog);
router.delete(
  "/:id",
  authMiddleware,
  authorizePermissions("can_delete_blog"),
  deleteBlog
);
router.patch(
  "/:id",
  authMiddleware,
  authorizePermissions("can_edit_blog"),
  upload.single("image"),
  changeBlog
);

export default router;
