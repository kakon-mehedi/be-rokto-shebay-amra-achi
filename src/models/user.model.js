import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const addressSchema = new Schema({
    addressLine: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        minLength: 11,
        maxLength: 14,
        required: true,
        unique: true,
    },
});

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        unique: [true, "Email already exist"],
    },

    password: {
        type: String,
    },

    address: {
        type: addressSchema,
        required: true,
    },

    bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
        required: true,
    },

    lastDonationDate: {
        type: String,
    },

    totalNumberOfDonation: {
        type: Number,
        default: 0,
    },

    profilePhoto: {
        type: String,
    },
    
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
      },
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

const User = new mongoose.model("User", userSchema);

export { User };
