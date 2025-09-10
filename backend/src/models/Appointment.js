const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // only if booked with doctor
    department: { type: String, required: true }, // e.g. "Outpatient", "Maternity"
    serviceType: {
      type: String,
      enum: ["consultation", "admission", "procedure"],
      required: true,
    },
    date: { type: Date, required: true },
    status: {
      type: String, //Enum ['pending', 'approved' , 'cancelled' , 'past']
      default: "pending",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Appointment ||
  mongoose.model("Appointment", appointmentSchema);
