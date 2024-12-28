import { Donor } from "../models/donor.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addDonor = asyncHandler(async (req, res) => {
    const { name, address, mobileNumber, bloodGroup } =
        req.body;

    [name, address, mobileNumber, bloodGroup].forEach((item) => {
        if (!item) throw new ApiError(400, "Please provide required data");
    });

    const existedMobileNumber = await Donor.findOne({
        "mobileNumber": mobileNumber,
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
        new ApiResponse(
            201,
            createdDonor,
            "Donor registered successfully"
        )
    );
});


const updateDonor = asyncHandler((req, res) => {});
const deleteDonor = asyncHandler((req, res) => {});
const getDonors = asyncHandler(async (req, res) => {
    const donors = await Donor.find().limit(10);

    if (!donors) {
        throw new ApiError(500, "Something went wrong while fetching donors");
    }

    res.status(200).json(
        new ApiResponse(200, donors, "Donors get successfully")
    );
});
const getDonorDetails = asyncHandler((req, res) => {});

const updateDonationDate = asyncHandler(async (req, res) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
            lastDonationDate: req.body.lastDonationDate,
        },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!updatedUser) {
        throw new ApiError(
            500,
            "Something went wrong while updating donation date"
        );
    }

    res.status(201).json(new ApiResponse(201, "User is updated successfully"));
});

export {
    addDonor,
    updateDonor,
    deleteDonor,
    getDonors,
    getDonorDetails,
    updateDonationDate,
};
