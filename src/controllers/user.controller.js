import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
    const {
        name,
        address,
        bloodGroup,
    } = req.body;

    const profilePhotoLocalPath = req.file.path;

    [name, bloodGroup].forEach((item) => {
        if (!item) throw new ApiError(401, "Please provide required data");
    });

    let profilePhoto = '';

    if (profilePhotoLocalPath) {
        profilePhoto = await uploadOnCloudinary(profilePhotoLocalPath);
    }

    const createdUser = await User.create({...req.body, profilePhoto: profilePhoto.url || ''} );

    res.status(201).json(
        new ApiResponse(201, createdUser , "User registerd successfully")
    );
});

export { registerUser };
