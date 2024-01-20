import { Router } from "express";
import {
    getUserDetails,
    getUsers,
    loginUser,
    registerUser,
    updateUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyAdmin, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.single("profilePhoto"), registerUser);
router.route("/login").post(loginUser);

// Secured Routes

// Admin routes
router.route("/").get(verifyJWT, verifyAdmin, getUsers);
router.route("/:id").get(verifyJWT, verifyAdmin, getUserDetails);
router.route("/:id").put(verifyJWT, verifyAdmin, updateUser);

export default router;
