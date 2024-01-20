import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating tokens!"
        );
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, confirmPassword, address, bloodGroup } =
        req.body;

    [name, address, bloodGroup].forEach((item) => {
        if (!item) throw new ApiError(400, "Please provide required data");
    });

    const existedMobileNumber = await User.findOne({
        "address.mobileNumber": address.mobileNumber,
    });

    if (existedMobileNumber) {
        throw new ApiError(400, "Mobile Number already exist");
    }

    if (email) {
        const isEmailExist = await User.findOne({email});

        if (isEmailExist) {
            throw new ApiError(400, "Email already exist");
        }
    }

    if (password) {
        if (password !== confirmPassword) {
            throw new ApiError(400, "Confirm password doesnot match");
        }
    }

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

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    [email, password].forEach((item) => {
        if (!item) {
            throw new ApiError(400, "Email and Password are required");
        }
    });

    const user = await User.findOne({ email: email });

    if (!user) {
        throw new ApiError(401, 'User not found with this email');
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Password is not correct");
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(
        user._id
    );

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken",
    );

    const cookieOptions = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(new ApiResponse(200, loggedInUser, "User loggedin successfully"));
});

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    if (!users)
        throw new ApiError(500, "Something went wrong while fetching users");

    res.status(200).json(new ApiResponse(200, users, "Users get successfully"));
});

const getUserDetails = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new ApiError(404, "User not found with that Id");

    res.status(200).json(
        new ApiResponse(200, user, "User details found successfully")
    );
});

const updateUser = asyncHandler(async (req, res) => {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(201).json(
        new ApiResponse(201, updatedUser, "User updated successfully")
    );
});

export { registerUser, getUsers, getUserDetails, updateUser, loginUser };
