import mongoose, { Schema } from "mongoose";

const donorSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },

    address: {
        type: String,
        required: true,
    },

    mobileNumber: {
        type: String,
        required: true,
    },

    bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
        required: [true, "Blood group is required"],
    },

    lastDonationDate: {
        type: Date,
        default: Date.now,
    },

    totalNumberOfDonation: {
        type: Number,
        default: 0,
    },

    profilePhoto: {
        type: String,
    },
});


const Donor = new mongoose.model("Donor", donorSchema);

export { Donor };
