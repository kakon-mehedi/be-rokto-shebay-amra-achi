import { Donor } from "../models/donor.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addDonor = asyncHandler(async (req, res) => {
    const { name, address, mobileNumber, bloodGroup } = req.body;

    [name, address, mobileNumber, bloodGroup].forEach((item) => {
        if (!item) throw new ApiError(400, "Please provide required data");
    });

    const existedMobileNumber = await Donor.findOne({
        mobileNumber: mobileNumber,
    });

    if (existedMobileNumber) {
        throw new ApiError(400, "Mobile Number already exist");
    }

    let profilePhoto = "";
    const profilePhotoLocalPath = req.file?.path;

    if (profilePhotoLocalPath) {
        profilePhoto = await uploadOnCloudinary(profilePhotoLocalPath);
    }

    const createDonorPayload = {
        ...req.body,
        profilePhoto: profilePhoto.url || "",
    };

    const createdDonor = await Donor.create(createDonorPayload);

    res.status(201).json(
        new ApiResponse(201, createdDonor, "Donor registered successfully")
    );
});

const updateDonor = asyncHandler(async (req, res) => {
    const updatedDonor = await Donor.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!updatedDonor) {
        throw new ApiError(404, "Donor not found");
    }

    res.status(200).json(
        new ApiResponse(200, updatedDonor, "Donor updated successfully")
    );
});
const deleteDonor = asyncHandler(async (req, res) => {
    const deletedDonor = await Donor.findByIdAndDelete(req.params.id);

    if (!deletedDonor) {
        throw new ApiError(404, "Donor not found");
    }

    res.status(200).json(
        new ApiResponse(200, deletedDonor, "Donor deleted successfully")
    );
});
const getDonors = asyncHandler(async (req, res) => {
    const donors = await Donor.find().limit(10);

    if (!donors) {
        throw new ApiError(500, "Something went wrong while fetching donors");
    }

    res.status(200).json(
        new ApiResponse(200, donors, "Donors get successfully")
    );
});
const getDonorDetails = asyncHandler(async (req, res) => {
    const donor = await Donor.findById(req.params.id);

    if (!donor) {
        throw new ApiError(404, "Donor not found");
    }

    res.status(200).json(
        new ApiResponse(200, donor, "Donor details found successfully")
    );
});

const updateDonationDate = asyncHandler(async (req, res) => {
    const updatedDonor = await Donor.findByIdAndUpdate(
        req.params.id,
        {
            lastDonationDate: req.body.lastDonationDate,
        },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!updatedDonor) {
        throw new ApiError(
            500,
            "Something went wrong while updating donation date"
        );
    }

    res.status(201).json(
        new ApiResponse(
            201,
            updatedDonor,
            "Donor donation date updated successfully"
        )
    );
});

export {
    addDonor,
    updateDonor,
    deleteDonor,
    getDonors,
    getDonorDetails,
    updateDonationDate,
};
