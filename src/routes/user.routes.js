import { Router } from "express";
import {
    getUserDetails,
    getUsers,
    registerUser,
    updateUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").get(getUsers);
router.route("/:id").get(getUserDetails);
router.route("/:id").put(updateUser);
router.route("/register").post(upload.single("profilePhoto"), registerUser );

export default router;
