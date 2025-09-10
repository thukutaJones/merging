const mongoose = require("mongoose");

const PatientDetailsSchema = new mongoose.Schema({
  homeAddress: {
    type: String,
  },
  nationalId: {
    type: String,
  },
  emergencyContact: {
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    relationship: {
      type: String,
    },
  },
  medicalConditions: [
    {
      type: String,
    },
  ],
  medicalRecords: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("PatientDetail", PatientDetailsSchema);
