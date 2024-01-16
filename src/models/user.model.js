import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema({
    addressLine: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        min: 11,
        max: 14,
        required: true,
        unique: true
    },
});

const userSchema = new Schema({
    name: {
        type: String,
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
        default: 0
    },

    profilePhoto: {
        type: String
    }
});

const User = new mongoose.model("User", userSchema);

export { User };
