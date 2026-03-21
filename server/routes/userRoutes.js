import express from "express";
import { getUsers, deleteUser, getUserProfile, updateUserProfile,updateUserByAdmin, updateUserRole } from "../controllers/userController.js";
import { protect, adminOnly } from "../middlewares/auth.js"; 
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, upload.single("profilePic"), updateUserProfile);

router.get("/", protect, adminOnly, getUsers);
router.delete("/:id", protect, adminOnly, deleteUser);

router.put("/:id", protect, adminOnly, updateUserByAdmin); 

router.put("/:id/role", protect, adminOnly, updateUserRole);

export default router;