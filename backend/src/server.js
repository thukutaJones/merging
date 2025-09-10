const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const http = require("http");
const webPush = require("web-push");
const { Server } = require("socket.io");
require("dotenv").config();

const { generatePassword } = require("./utils/generatePassword");

// Server setup
const server = express();
const socketServer = http.createServer(server);

const io = new Server(socketServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(morgan("dev"));

webPush.setVapidDetails(
  "mailto:you@example.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// socket.io user map
const userSocketMap = {};

// MODELS
const User = require("./models/User");
const Department = require("./models/Departments");
const Emergency = require("./models/Emergencies");
const Appointment = require("./models/Appointment");
const Enquiry = require("./models/Enquiry");
const Chat = require("./models/Chats");
const {
  sendNewEnquiryEmail,
  welcomeEmail,
  sendEmergencyNotification,
} = require("./services/emai.service");
const PatientDetails = require("./models/PatientDetails");
const StaffDetails = require("./models/StaffDetails");
const getAvailableDriver = require("./utils/getAvailableDriver");
const { default: next } = require("next");
const getLangChainResponse = require("./services/chatbotLogic");

// JWT Auth Middleware
const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header)
    return res.status(401).json({ message: "Missing authorization header" });
  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "changeme");
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ---- API ROUTES ----

// Health check
server.get("/api/health", (req, res) => res.json({ ok: true }));

// Register
server.post("/api/auth/register", async (req, res, next) => {
  try {
    const { email, password, name, role, patientDetailsData } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    if (role !== "patient") {
      return res.status(400).json({
        status: "failed",
        message: "Only normal users are allowed through this route",
      });
    }

    const exists = await User.findOne({ email });
    if (exists)
      return res
        .status(409)
        .json({ message: "User with email already exists" });
    const patientData = await PatientDetails.create(patientDetailsData);

    const user = new User({
      ...req.body,
      linkePatientDetails: patientData?._id,
    });
    await user.save();

    const token = user.generateToken();
    res.status(201).json({
      user: { id: user._id, email: user.email, name: user.name },
      token,
    });
  } catch (err) {
    next(err);
  }
});

// Add user
server.post("/api/user", async (req, res, next) => {
  const {
    email,
    name,
    role,
    gender,
    patientDetailsData,
    staffDetailsData,
    department,
  } = req.body;
  if (!name || !email || !gender || !role) {
    return res
      .status(400)
      .json({ message: "Please fill in all required fields" });
  }
  try {
    const existingEmail = await User.findOne({ email: email });

    if (existingEmail) {
      return res.status(400).json({
        status: "failed",
        message: "User with that email already exists",
      });
    }
    if (
      (role === "nurse" || role === "doctor" || role === "ambulance_driver") &&
      !staffDetailsData
    ) {
      return res.status(400).json({
        status: "failed",
        message: "Please provide staff data",
      });
    }

    const password = generatePassword();

    let payload = { email, name, role, gender, password };

    if (role === "patient") {
      const patientData = await PatientDetails.create(patientDetailsData);
      payload = { ...payload, linkePatientDetails: patientData?._id };
    }

    if (
      role === "admin" ||
      role === "nurse" ||
      role === "doctor" ||
      role === "ambulance_driver"
    ) {
      const staffData = await StaffDetails.create(staffDetailsData);
      payload = { ...payload, linkedStaffDetails: staffData?._id, department };
    }

    if (role === "hod") {
      payload = { ...payload, department };
    }

    const user = await User.create(payload);

    await welcomeEmail(email, "WELCOME TO WMC SYSTEM", name, password, role);

    return res
      .status(201)
      .json({ message: "User created successfully", status: "success" });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Email or Phone number already exists" });
    }
    next(error);
  }
});
// Login
server.post("/api/auth/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = user.generateToken();
    res.json({
      user: { id: user._id, email: user.email, name: user.name },
      token,
    });
  } catch (err) {
    next(err);
  }
});

generatepwd = require("./generatePwd")

// Create Patient account
server.post("/api/users/createPatient", auth, async (req, res) => {
  try {
    const { full_name, email, phone_number, patientDetails, gender, dob, preferredLanguage } = req.body;
    console.log(req.body)
    // Only allow patient creation if admin or staff with permission
    if (!req.user || !['admin'].includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Only admin can create patients" });
    }

    // Validate
    if (!full_name || !email || !gender || !dob) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: "User already exists" });

    const password = generatepwd(12)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User with linkedPatientId
    const newUser = new User({
      full_name,
      email,
      password: hashedPassword,
      role: 'patient',
      phone: phone_number || "",
      gender,
      dob,
      preferredLanguage: preferredLanguage || 'en',
      accessibility: { screenReader: false, largeText: false, colorContrast: false },
      pushTokens: [],
      createdAt: new Date(),
    });

    await newUser.save();

    // Create linked Patient record
    const patientRecord = new Patient({
      userId: newUser._id,
      address: patientDetails.address || {},
      nationId: patientDetails.nationalId || "",
      conditions: patientDetails.conditions || [],
      emergencyContact: patientDetails.emergencyContact || {},
      medicalRecords: patientDetails.medicalRecords || [],
    });
    await patientRecord.save();

    await sendMail({
      to: email,
      subject: "WEZI Clinic Account Creation",
      html: `
          <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; background: #f8fafc;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 24px; border-radius: 8px;">
              <h1 style="font-size: 1.25rem; color: #1f2937;">Hello ${full_name},</h1>
              <p style="margin: 16px 0;">
               You are recieving this because you have created an account with WEZI clinic.
              </p>
              <div style="background: #f1f5f9; padding: 16px; border-radius: 6px; text-align: center;">
                <p style="margin: 0;">Your login email:</p>
                <p style="font-size: 1.5rem; font-weight: bold; color: #1e3a8a;">${email}</p>
                <p>Use this email to login</p>
              </div>
              <div style="background: #f1f5f9; padding: 16px; border-radius: 6px; text-align: center;">
                <p style="margin: 0;">Your login pasword:</p>
                <p style="font-size: 1.5rem; font-weight: bold; color: #1e3a8a;">${password}</p>
                <p>Use this password to login</p>
              </div>
              <p style="margin-top: 16px;">welcome to WEZI Clinic , enjoy our services</p>
              <hr style="margin: 24px 0;" />
              <p>If you didn't request this login, contact us at <a href="mailto:weziclinic@support.com">weziclinic@support.com<a></p>
              <p style="margin-top: 32px;">– WEZI Clinic Security Team</p>
            </div>
          </div>
        `,
    }).then(() => {
      console.log(`email sent to: ${email}`)
    })
    res.status(201).json({
      message: "Patient account created successfully",
      user: {
        id: newUser._id,
        full_name: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all home cards
server.get('/api/homecards', async (req, res, next) => {
  try {
    const homeCards = await HomeCard.find({});
    res.json(homeCards);
  } catch (err) {
    next(err);
  }
});

// Get all FAQs
server.get('/api/faqs', async (req, res, next) => {
  try {
    const faqs = await FAQ.find({});
    res.json(faqs);
  } catch (err) {
    next(err);
  }
});

// Department CRUD Operations
// Create a new department (Admin only)
server.post('/api/departments/create', auth, async (req, res) => {
  try {
    const { name, description, location, head, mapCoords } = req.body;
    const newDepartment = new Department({ name, description, location, head, mapCoords });
    await newDepartment.save();
    res.status(201).json(newDepartment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all departments
server.get('/api/departments/all', auth, async (req, res) => {
  try {
    const departments = await Department.find({}); // Populate head with user name and email
    res.status(200).json({ data: departments });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get a single department by ID
server.get('/api/departments/:id', async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate('head', 'name email');
    if (!department) {
      return res.status(404).json({ msg: 'Department not found' });
    }
    res.json(department);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a department by ID (Admin only)
server.put('/api/departments/:id', auth, async (req, res) => {
  try {
    const { name, description, location, head, mapCoords } = req.body;
    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      { $set: { name, description, location, head, mapCoords } },
      { new: true }
    ).populate('head', 'name email');

    if (!updatedDepartment) {
      return res.status(404).json({ msg: 'Department not found' });
    }
    res.json(updatedDepartment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a department by ID (Admin only)
server.delete('/api/departments/:id', auth, async (req, res) => {
  try {
    const deletedDepartment = await Department.findByIdAndRemove(req.params.id);
    if (!deletedDepartment) {
      return res.status(404).json({ msg: 'Department not found' });
    }
    res.json({ msg: 'Department removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create Staff account (admin only)
server.post("/api/users/createStaff", auth, async (req, res) => {
  try {
    const { full_name, email, role, phone, gender, dob, staffDetails } = req.body;
    console.log(req.body)
    // Only admin can create staff
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden: Only admin can create staff accounts" });
    }

    if (!full_name || !email || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: "User already exists" });
    const password = generatepwd(12);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User linked to Staff
    const newUser = new User({
      full_name,
      email,
      password: hashedPassword,
      role: 'staff',
      phone: phone || "",
      gender,
      dob,
      preferredLanguage: 'en',
      accessibility: { screenReader: false, largeText: false, colorContrast: false },
      pushTokens: [],
      createdAt: new Date(),
    });

    await newUser.save();

    // Create Staff record
    const staffRecord = new Staff({
      userId: newUser._id,
      roleWithin: staffDetails.roleWithin,
      specialties: staffDetails.specialties || [],
      departmentId: staffDetails.department || null,
      workingHours: staffDetails.workingHours || [],
      isAvailable: true,
    });
    await staffRecord.save();
    await sendMail({
      to: email,
      subject: "WEZI Clinic Account Creation",
      html: `
          <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; background: #f8fafc;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 24px; border-radius: 8px;">
              <h1 style="font-size: 1.25rem; color: #1f2937;">Hello ${full_name},</h1>
              <p style="margin: 16px 0;">
               You are recieving this because you have created an account with WEZI clinic.
              </p>
              <div style="background: #f1f5f9; padding: 16px; border-radius: 6px; text-align: center;">
                <p style="margin: 0;">Your login email:</p>
                <p style="font-size: 1.5rem; font-weight: bold; color: #1e3a8a;">${email}</p>
                <p>Use this email to login</p>
              </div>
              <div style="background: #f1f5f9; padding: 16px; border-radius: 6px; text-align: center;">
                <p style="margin: 0;">Your login pasword:</p>
                <p style="font-size: 1.5rem; font-weight: bold; color: #1e3a8a;">${password}</p>
                <p>Use this password to login</p>
              </div>
              <p style="margin-top: 16px;">welcome to WEZI Clinic , enjoy our services</p>
              <hr style="margin: 24px 0;" />
              <p>If you didn't request this login, contact us at <a href="mailto:weziclinic@support.com">weziclinic@support.com</a></p>
              <p style="margin-top: 32px;">– WEZI Clinic Security Team</p>
            </div>
          </div>
        `,
    }).then(() => {
      console.log(`email sent to: ${email}`)
    })
    res.status(201).json({
      message: "Staff account created successfully",
      user: {
        id: newUser._id,
        full_name: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
        linkedStaffId: newUser.linkedStaffId
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


server.get('/api/users/all', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude password

    if (!users.length) {
      return res.status(404).json({ success: false, message: "No users found" });
    }

    // Populate extra data based on role
    const usersWithDetails = await Promise.all(users.map(async (user) => {
      const userObj = user.toObject();

      if (user.role === 'staff') {
        const staff = await Staff.findOne({ userId: user._id })
          .populate('departmentId', 'name description') // populate department info
          .lean();
        userObj.staffDetails = staff || null;
      }

      if (user.role === 'patient') {
        const patient = await Patient.findOne({ userId: user._id }).lean();
        userObj.patientDetails = patient || null;
      }

      console.log(userObj)
      return userObj;
    }));

    return res.status(200).json({ success: true, data: usersWithDetails });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

const ServiceModel = require("./models/Services")
// GET all services
server.get("/api/services/all", auth, async (req, res) => {
  try {
    const services = await ServiceModel.find().populate("departmentId");
    res.json({ success: true, data: services });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST add service
server.post("/api/services/add", auth, async (req, res) => {
  try {
    const service = new ServiceModel(req.body);
    await service.save();
    const populated = await service.populate("departmentId");
    res.json({ success: true, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to add service" });
  }
});

// PUT update service
server.put("/api/service/update/:id", auth, async (req, res) => {
  try {
    const service = await ServiceModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("departmentId");
    res.json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update service" });
  }
});

// DELETE service
server.delete("/api/service/delete/:id", auth, async (req, res) => {
  try {
    await ServiceModel.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete service" });
  }
});

// Get current user profile
// Get current user profile
server.get('/api/profile/details', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .select('-password -passwordHash')
      .lean(); // convert to plain JS object

    if (!user) return res.status(404).json({ status: 404, message: 'User not found' });

    // If user is staff, populate staff details
    if (['admin', 'doctor', 'staff'].includes(user.role)) {
      const staffDetails = await Staff.findOne({ userId: user._id }).populate('departmentId').lean();
      if (staffDetails) {
        user.staffDetails = staffDetails
        user.departmentDetails = staffDetails.departmentId
      };

      console.log(staffDetails)
    }

    // If patient, populate patient details
    if (user.role === 'patient') {
      const patientDetails = await Patient.findOne({ userId: user._id }).lean();
      if (patientDetails) user.patientDetails = patientDetails;
    }

    res.status(200).json({ status: 200, data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, message: 'Server error', error: err.message });
  }
});


server.post("/api/profile/edit", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    // Pick only allowed fields
    const allowedFields = ["full_name", "email", "phone", "gender", "dob", "medicalCard", "emergencyContact"];
    const sanitizedUpdates = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) sanitizedUpdates[key] = updates[key];
    }

    const updatedUser = await User.findByIdAndUpdate(userId, sanitizedUpdates, { new: true })
      .select("-password"); // never return password

    if (!updatedUser) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    res.status(200).json({ status: 200, data: updatedUser });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ status: 500, message: "Server error", error: err.message });
  }
});


// Appointments
server.post("/api/appointments", auth, async (req, res, next) => {
  try {
    const appt = new Appointment({ ...req.body, createdBy: req.user.id });
    await appt.save();
    res.status(201).json(appt);
  } catch (err) {
    next(err);
  }
});

server.get('/api/appointments/all', auth, async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'doctor') {
      query = { staffId: req.user.id };
    } else if (req.user.role === 'patient') {
      query = { patientId: req.user.id };
    }

    // console.log(req.user.id, query)

    const appointments = await Appointment.find(query)
      .populate([
        { path: "staffId", populate: { path: "departmentId" } },
        { path: "serviceId" },
        { path: "patientId" },
      ]);


    // Normalize response for frontend
    const normalized = appointments.map((appt) => ({
      _id: appt._id,
      service: appt.serviceId?.name || "",
      serviceId: appt.serviceId || "",
      staffId: appt.staffId || "",
      staffIdDetails: appt.staffId
        ? {
          id: appt.staffId._id,
          full_name: appt.staffId.full_name,
          roleWithin: appt.staffId.roleWithin,
          department: appt.staffId.departmentId
            ? { name: appt.staffId.departmentId.name }
            : null,
          specialties: appt.staffId.specialties || [],
          isAvailable: appt.staffId.isAvailable || false,
        }
        : null,
      patientId: appt.patientId || null,
      patientDetails: appt.patientId
        ? {
          id: appt.patientId._id,
          full_name: appt.patientId.full_name,
        }
        : null,
      time: appt.time,
      date: appt.date,
      notes: appt.notes,
      status: appt.status,
      createdAt: appt.createdAt,
      updatedAt: appt.updatedAt,
    }));

    console.log("appintement details: ", normalized)
    res.json({ data: normalized });
  } catch (err) {
    next(err);
  }
});

// Get all messages for a specific patient
server.get("/api/enquires/:patientId", auth, async (req, res, next) => {
  try {
    const { patientId } = req.params;

    // 1️⃣ Update all messages for this patient to mark as read/unread = false
    await Enquiry.updateMany(
      { senderId: patientId, unread: true }, // only unread messages from patient
      { $set: { unread: false } }
    );

    // 2️⃣ Fetch all messages between HODs and this patient
    const messages = await Enquiry.find({
      $or: [{ senderId: patientId }, { receiverId: patientId }],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
});

// Get patient conversations for HODs
server.get("/api/enquires/hod/conversations", async (req, res, next) => {
  try {
    const conversations = await Enquiry.aggregate([
      {
        $match: { sender: "patient" }, // only patient messages
      },
      { $sort: { createdAt: -1 } }, // newest first
      {
        $group: {
          _id: "$senderId",
          lastMessage: { $first: "$text" },
          lastMessageAt: { $first: "$createdAt" },
          patientId: { $first: "$senderId" },
          unread: { $max: { $cond: [{ $eq: ["$seen", false] }, 1, 0] } }, // 1 = unread, 0 = all read
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "patientId",
          foreignField: "_id",
          as: "patient",
        },
      },
      { $unwind: "$patient" },
      { $sort: { lastMessageAt: -1 } },
    ]);

    // Convert unread from 0/1 to boolean
    const formatted = conversations.map((conv) => ({
      ...conv,
      unread: conv.unread === 1,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    next(error);
  }
});

// Store subscription for user
server.post("/api/push/subscribe", auth, async (req, res) => {
  try {
    const { subscription } = req.body;
    console.log(subscription);
    const userId = req.user.id;

    console.log(userId);

    await User.findByIdAndUpdate(userId, { pushSubscription: subscription });
    res.status(200).json({ status: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save subscription" });
  }
});

server.post("/api/department", async (req, res, next) => {
  const { name, roomNumber } = req.body;
  if (!name || !roomNumber) {
    return res
      .status(400)
      .json({ message: "Name and room number are required" });
  }
  try {
    const existingDepartment = await Department.findOne({ name: name });
    if (existingDepartment) {
      return res.status(400).json({
        status: "failed",
        message: "Department with that name already exists",
      });
    }

    await Department.create(req.body);
    return res
      .status(201)
      .json({ message: "Department created successfully", status: "success" });
  } catch (error) {
    next(error);
  }
});

// get active emergency for patients
server.get("/api/emergency/active/:userType/:id", async (req, res, next) => {
  try {
    const { id, userType } = req.params;

    const filter =
      userType === "guest"
        ? { userDeviceId: id, status: { $ne: "completed" } }
        : { sender: id, status: { $ne: "completed" } };

    const emergency = await Emergency.findOne(filter).populate(
      "assignedTo sender"
    );

    res.status(200).json({
      status: "success",
      emergency: emergency || null,
    });
  } catch (error) {
    next(error);
  }
});

// Get active emergency for ambulance drivers
server.get("/api/emergency/active/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const emergency = await Emergency.findOne({
      assignedTo: id,
      status: { $ne: "completed" },
    }).populate("sender assignedTo");

    res.status(200).json({ status: "success", emergency: emergency || null });
  } catch (error) {
    next(error);
  }
});

// Get drivers' emergencies
server.get("/driver/:driverId", async (req, res) => {
  try {
    const { driverId } = req.params;

    const emergencies = await Emergency.find({ "assignedTo._id": driverId })
      .populate("sender", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({ status: "success", emergencies });
  } catch (err) {
    console.error("Error fetching driver emergencies:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Main chatbot API endpoint - now an async function
server.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res
      .status(400)
      .json({ error: "Message is required in the request body." });
  }

  try {
    // Await the response from our new LangChain logic
    const botReply = await getLangChainResponse(message);
    const newResponse = await Chat.create({ message: botReply, sender: "bot" });
    res.json({ message: newResponse, sender: "bot" });
  } catch (error) {
    console.error("API Error:", error);
    res
      .status(500)
      .json({ error: "Failed to get a response from the chatbot." });
  }
})
// Cancel
server.put('/api/appointments/cancel/:id', auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const cancelOne = await Appointment.findByIdAndUpdate(
      id,
      { status: "cancelled" },
      { new: true }
    );
    res.json({ data: cancelOne });
  } catch (err) {
    next(err);
  }
});

// Update status (general)
server.put('/api/appointments/update-status/:id', auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    // const { status } = req.body;

    const updated = await Appointment.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );
    const user = await User.findById(updated.patientId)
    if (user) {
      await sendMail({
        to: user.email,
        subject: `Appointement update - ${updated._id}`,
        html: `
<div style="font-family: 'Segoe UI', sans-serif; padding: 20px; background: #f0fdf4;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 24px; border-radius: 8px; border: 1px solid #d1fae5;">
    
    <h1 style="font-size: 1.5rem; color: #065f46; margin-bottom: 16px;">
      Appointment Approved!
    </h1>
    
    <p style="font-size: 1rem; color: #065f46; margin-bottom: 24px;">
      Hello <strong>${user.full_name}</strong>, your appointment has been successfully approved. Please find the details below:
    </p>

    <div style="background: #d1fae5; padding: 16px; border-radius: 6px; margin-bottom: 16px;">
      <p style="margin: 0; font-weight: bold; color: #065f46;">Service:</p>
      <p style="margin: 4px 0 0;">${Appointment.service}</p>
    </div>

    <div style="background: #d1fae5; padding: 16px; border-radius: 6px; margin-bottom: 16px;">
      <p style="margin: 0; font-weight: bold; color: #065f46;">Date & Time:</p>
      <p style="margin: 4px 0 0;">
        ${new Date(Appointment.time).toLocaleDateString()} at ${new Date(Appointment.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>

    <div style="background: #d1fae5; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
      <p style="margin: 0; font-weight: bold; color: #065f46;">Location / Department:</p>
      <p style="margin: 4px 0 0;">${Appointment.staffIdDetails?.department?.name || "Not specified"}</p>
    </div>

    <p style="font-size: 0.95rem; color: #065f46;">
      Thank you for using WEZI Clinic. We look forward to seeing you at your appointment!
    </p>

    <hr style="margin: 24px 0; border-color: #d1fae5;" />

    <p style="font-size: 0.85rem; color: #065f46;">
      If you have any questions, please contact us at 
      <a href="mailto:weziclinic@support.com" style="color: #10b981; text-decoration: none;">weziclinic@support.com</a>.
    </p>

    <p style="margin-top: 24px; font-size: 0.85rem; color: #065f46;">– WEZI Clinic Team</p>
  </div>
</div>

        `,
      })
    }
    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
});

// Add at the top with other requires
const { detect } = require("langdetect");
const staff = require('./models/staff');

// Simple in-memory chat history
const chatHistory = {};

// Chat endpoint
server.post('/api/chat', auth, async (req, res) => {
  try {
    const { message, preferredLang } = req.body;
    const userId = req.user.id;

    if (!message) return res.status(400).json({ error: "Message required" });

    // Detect language
    let lang = "English";
    if (preferredLang) lang = preferredLang;
    else {
      const detected = detect(message).slice(0, 2);
      if (detected === 'ny') lang = 'Chichewa';
      if (detected === 'tu') lang = 'Tumbuka';
    }

    // Retrieve chat history for this user
    const history = chatHistory[userId] || [];

    // Construct prompt for AI (if using LLM)
    const prompt = `You are a helpful assistant for Wezi Medical Centre.
Focus on enquiries about services, navigation, and bookings.
Respond in ${lang}.
History: ${history.join("\n")}
User: ${message}
Assistant:`;

    // Dummy AI response (replace with LLM call)
    const botResponse = `Echo (${lang}): ${message}`;

    // Save to history
    if (!chatHistory[userId]) chatHistory[userId] = [];
    chatHistory[userId].push(`User: ${message}`);
    chatHistory[userId].push(`Bot: ${botResponse}`);

    res.json({ reply: botResponse });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Dashboard stats for admin

server.get('/dashboard/admin', auth, async (req, res) => {
  try {
    // Only admin can access
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }

    // Count patients
    const patientsCount = await User.countDocuments({ role: 'patient' });

    // Count staff
    const staffCount = await User.countDocuments({ role: 'staff' });

    // Count HODs (department heads)
    const hodsCount = await User.countDocuments({ role: 'department_head' });

    // Count departments
    const departmentsCount = await Department.countDocuments();

    // Optional: send some user info for the dashboard hero
    const userInfo = await User.findById(req.user.id).select('full_name email role');

    res.json({
      userData: {
        id: userInfo._id,
        full_name: userInfo.full_name,
        email: userInfo.email,
        role: userInfo.role,
      },
      users: {
        patients: patientsCount,
        staff: staffCount,
        hods: hodsCount,
      },
      departments: departmentsCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// Central error handler
server.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Server error" });
});

io.on("connection", (socket) => {
  const userId = socket?.handshake?.query?.userId;

  console.log(`User ${userId} is active`);

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  socket?.on(
    "sendEnquiry",
    async ({ text, sender, timestamp, receiverId, senderId }) => {
      console.log(
        `Text: ${text}, sender: ${sender}, receiverId: ${receiverId}, senderId: ${senderId}`
      );

      try {
        // 1️⃣ Save the new enquiry
        const newEnquiry = await Enquiry.create({
          senderId,
          receiverId,
          timestamp,
          text,
          sender,
        });

        // 2️⃣ Emit to the specific receiver if connected
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receiveEnquiry", newEnquiry);
        }

        // 3️⃣ If sender is a patient, notify all active HODs
        if (sender === "patient") {
          const allHods = await User.find({ role: "hod" });

          const activeHods = allHods.filter((hod) => userSocketMap[hod?._id]);
          const offlineHods = allHods.filter((hod) => !userSocketMap[hod._id]);

          // Emit to all active HODs
          activeHods.forEach((hod) => {
            try {
              io.to(userSocketMap[hod._id]).emit("receiveEnquiry", newEnquiry);
            } catch (err) {
              console.log(`Failed to emit to HOD ${hod._id}:`, err);
            }
          });

          // 4️⃣ If no HODs are online send email notifications
          if (!activeHods.length) {
            allHods.forEach(async (hod) => {
              await sendNewEnquiryEmail(hod.email);
            });
          }
        }

        // 5️⃣ Optional: send email to the receiver if needed
      } catch (error) {
        console.error("Error sending enquiry:", error);
      }
    }
  );

  socket.on("sendEmergency", async (emergencyPayload, callback) => {
    const { userType, sender, userDeviceId, locationLat, locationLang } =
      emergencyPayload;

    try {
      const { availableDriver, email } = await getAvailableDriver();

      let status = "onHold";
      let assignedTo = null;

      if (availableDriver) {
        status = "assigned";
        assignedTo = availableDriver;
      }

      // Create emergency
      let newEmergency = await Emergency.create({
        userType,
        ...(userType === "registred" ? { sender } : { userDeviceId }),
        locationLat,
        locationLang,
        status,
        assignedTo,
      });

      // ✅ Populate sender and assignedTo
      newEmergency = await newEmergency.populate([
        { path: "sender" },
        { path: "assignedTo" },
      ]);

      // Notify driver if connected
      if (availableDriver && userSocketMap[availableDriver]) {
        io.to(userSocketMap[availableDriver]).emit(
          "receiveEmergency",
          newEmergency
        );
      }

      // Send email
      if (email) {
        await sendEmergencyNotification(email, {
          locationLat,
          locationLang,
        });
      }

      console.log(newEmergency);

      // ✅ Send populated emergency back to client
      callback({ status: "success", emergency: newEmergency });
    } catch (err) {
      console.error("Error creating emergency:", err);
      callback({ status: "error", message: err.message });
    }
  });

  socket?.on("completeEmergency", async (id, callback) => {
    try {
      // Mark the current emergency as completed
      const emergency = await Emergency.findByIdAndUpdate(
        id,
        { status: "completed" },
        { new: true }
      );

      if (!emergency) {
        return callback({ status: "error", message: "Emergency not found" });
      }

      //update the patient's side
      if (userSocketMap[emergency.sender]) {
        io.to(userSocketMap[emergency.sender]).emit("completedEmergency");
      }

      //update the driver's side
      if (userSocketMap[emergency.assignedTo]) {
        io.to(userSocketMap[emergency.assignedTo]).emit("completedEmergency");
      }

      // Find the next emergency that is on hold
      const nextEmergency = await Emergency.findOne({ status: "onHold" });

      if (nextEmergency) {
        nextEmergency.status = "assigned";
        nextEmergency.assignedTo = emergency.assignedTo;
        await nextEmergency.save();

        // Fetch the email of the driver/staff assigned
        const userData = await Emergency.findById(nextEmergency._id)
          .populate("assignedTo", "email")
          .select("assignedTo");

        const email = userData?.assignedTo?.email;

        if (email) {
          await sendEmergencyNotification(email, "New Emergency Assigned", {
            userLocationLatitude: nextEmergency.userLocationLatitude,
            userLocationLongitude: nextEmergency.userLocationLongitude,
          });
        }
      }

      // Send back success via socket callback
      callback({
        status: "success",
        message: "Emergency completed successfully",
        data: emergency,
      });
    } catch (err) {
      console.error("Error completing emergency:", err);
      callback({ status: "error", message: err.message });
    }
  });

  socket.on("initiateChat", async (intiateChatPayload, callback) => {
    try {
      const prompt = `You are a helpful assistant for Wezi Medical Centre only.
        Focus on enquiries about services (Outpatient, Inpatient, Emergency, Antenatal, Theatre), navigation, and bookings.
        Do not discuss unrelated topics.`;
    } catch (error) {
      callback({ status: "error", message: err.message });
    }
  });
})
  socket.on("disconnect", () => {
    if (userId && userSocketMap[userId]) {
      delete userSocketMap[userId];
    }
  });

// Start Server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});

// MongoDB Connection
const MONGO = process.env.MONGO_URI;
mongoose
  .connect(MONGO)
  .then(() => {
    console.log("✅ MongoDB connected");
    // Start Server
    const PORT = process.env.PORT;
    socketServer.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Backend running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
