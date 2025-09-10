const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    userId: { type: String },
    roleWithin: {
      type: String,
      enum: ["doctor", "nurse", "ambulance_driver", "technician", "other"],
      required: true,
    },
    specialties: { type: [String], default: [] }, // e.g. "Cardiology", "Pediatrics"
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    workingHours: [
      {
        day: { type: String },
        start: { type: String }, // "08:00"
        end: { type: String },   // "17:00"
      },
    ],
    isAvailable: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Staff || mongoose.model("Staff", staffSchema);
