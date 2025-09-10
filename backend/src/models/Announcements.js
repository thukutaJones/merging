// models/Announcement.js
const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    audience: {
      type: String,
      enum: [
        "all",
        "admin",
        "hod",
        "patient",
        "doctor",
        "ambulance_driver",
        "nurse",
      ],
      default: "all",
    },
    expiryDate: { type: Date },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Announcement ||
  mongoose.model("Announcement", announcementSchema);
