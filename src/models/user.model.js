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
    },
});

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    address: addressSchema,

    bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
        required: true,
    },

    lastDonationDate: {
        type: Date,
    },

    totalNumberOfDonation: {
        type: Number,
    },

    profilePhoto: {
        type: String
    }
});

const User = new mongoose.model("User", userSchema);

export { User };
