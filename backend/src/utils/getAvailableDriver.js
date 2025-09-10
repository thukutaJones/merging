const Emergency = require("../models/Emergencies");
const User = require("../models/User");

async function getAvailableDriver() {
  // 1. Find all emergencies that are currently assigned or on hold
  const activeEmergencies = await Emergency.find({
    status: { $in: ["assigned", "onHold"] },
  }).select("assignedTo");

  // 2. Collect IDs of users already busy
  const busyDriverIds = activeEmergencies
    .map((e) => e.assignedTo?.toString())
    .filter(Boolean);

  // 3. Find all active ambulance drivers
  const allDrivers = await User.find({
    role: "ambulance_driver",
    status: "active",
  }).select("_id email");

  // 4. Filter out busy ones
  const availableDrivers = allDrivers.filter(
    (r) => !busyDriverIds.includes(r._id.toString())
  );

  if (availableDrivers.length === 0) {
    console.log("⚠️ No available ambulance drivers right now.");
    return {};
  }

  // 5. Pick a random available driver
  const randomDriver =
    availableDrivers[Math.floor(Math.random() * availableDrivers.length)];

  console.log("✅ Assigned Driver ID:", randomDriver._id);
  console.log("📧 Assigned Driver Email:", randomDriver.email);

  return {
    availableDriver: randomDriver._id,
    email: randomDriver.email,
  };
}

module.exports = getAvailableDriver;
