const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema({
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: [true, "Please provide the department"],
  },
  workingHours: {
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
  specialties: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("StaffDetail", StaffSchema);
