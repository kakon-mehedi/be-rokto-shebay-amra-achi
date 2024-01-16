import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
    const { name, address, bloodGroup } = req.body;

    [name, address, bloodGroup].forEach((item) => {
        if (!item) throw new ApiError(400, "Please provide required data");
    });

    const existedMobileNumber = await User.findOne({
        "address.mobileNumber": address.mobileNumber,
    });
    if (existedMobileNumber)
        throw new ApiError(400, "Mobile Number already exist");

    let profilePhoto = "";
    const profilePhotoLocalPath = req.file?.path;

    if (profilePhotoLocalPath) {
        profilePhoto = await uploadOnCloudinary(profilePhotoLocalPath);
    }

    const createUserPayload = {
        ...req.body,
        profilePhoto: profilePhoto.url || "",
    };
    const createdUser = await User.create(createUserPayload);

    res.status(201).json(
        new ApiResponse(201, createdUser, "User registerd successfully")
    );
});

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    if (!users) throw new ApiError(500, 'Something went wrong while fetching users');

    res.status(200).json(
        new ApiResponse(200, users, 'Users get successfully')
    )

});

const getUserDetails = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new ApiError(404, 'User not found with that Id');

    res.status(200).json(
        new ApiResponse(200, user, 'User details found successfully')
    )
})

const updateUser = asyncHandler(async (req, res) => {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

    res.status(201).json(
        new ApiResponse(201, updatedUser, 'User updated successfully')
    )

})

export { 
    registerUser,
    getUsers,
    getUserDetails,
    updateUser
};
