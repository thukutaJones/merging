const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: ["patient", "hod", "admin", "ambulance_driver", "doctor", "nurse"],
      default: "patient",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    dob: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "deactivated", "deleted"],
      default: "active",
    },
    lastLogIn: {
      type: Date,
      default: null,
    },
    linkePatientDetails: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "PatientDetail",
    },
    linkedStaffDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StaffDetail",
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [
        function () {
          return (
            this?.role === "hod" ||
            this?.role === "doctor" ||
            this?.role === "nurse" ||
            this?.role === "ambulance_driver"
          );
        },
        "Department is required for hods and staff members",
      ],
    },
    pushSubscription: {
      type: {
        endpoint: { type: String },
        keys: {
          p256dh: { type: String },
          auth: { type: String },
        },
      },
      default: null,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  this.confirm = undefined;
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.generateToken = function () {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign(
    { id: this._id, role: this?.role, email: this?.email, name: this?.name },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

module.exports = mongoose.model("User", UserSchema);
