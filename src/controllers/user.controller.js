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

    [name, address, bloodGroup].forEach((item) => {
        if (!item) throw new ApiError(401, "Please provide required data");
    });

    const existedMobileNumber = await User.findOne({'address.mobileNumber': address.mobileNumber})
    if (existedMobileNumber) throw new ApiError(400, 'Mobile Number already exist');

    let profilePhoto = '';
    const profilePhotoLocalPath = req.file?.path;
    
    if (profilePhotoLocalPath) {
        profilePhoto = await uploadOnCloudinary(profilePhotoLocalPath);
    }

    const createUserPayload = {...req.body, profilePhoto: profilePhoto.url || ''};
    const createdUser = await User.create(createUserPayload);

    res.status(201).json(
        new ApiResponse(201, createdUser , "User registerd successfully")
    );
});

export { registerUser };
