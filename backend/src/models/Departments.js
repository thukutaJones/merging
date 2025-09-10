const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    roomNumber: {
      type: String,
    },
    head: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    mapCoords: {
      lat: Number,
      lng: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", departmentSchema);
