import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { addDonor, deleteDonor, getDonorDetails, getDonors, updateDonationDate, updateDonor } from "../controllers/donor.controller.js";

const router = Router();

// Public Routes
router.route("/").post(upload.single("profilePhoto"), addDonor);


// Admin only routes
router.route("/").get(verifyJWT, verifyAdmin, getDonors);
router.route("/:id").get(verifyJWT, verifyAdmin, getDonorDetails);
router.route("/:id").put(verifyJWT, verifyAdmin, updateDonor);
router.route("/:id").delete(verifyJWT, verifyAdmin, deleteDonor);
router.route("/:id/update-donation-date").put(updateDonationDate);

export default router;
