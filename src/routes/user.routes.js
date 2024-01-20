import { Router } from "express";
import {
    getUserDetails,
    getUsers,
    loginUser,
    registerUser,
    updateUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").get(getUsers);
router.route("/:id").get(getUserDetails);
router.route("/:id").put(updateUser);
router.route("/register").post(upload.single("profilePhoto"), registerUser );
router.route("/login").post(loginUser);

export default router;
