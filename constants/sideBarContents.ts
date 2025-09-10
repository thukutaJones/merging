import {
  RiDashboardLine,
  RiUser3Line,
  RiShieldLine,
  RiBuildingLine,
  RiAddLine,
  RiStethoscopeLine,
  RiClipboardLine,
  RiBarChartLine,
  RiPieChartLine,
  RiUserLine,
  RiInboxLine,
  RiCalendarLine,
  RiMessage2Line,
  RiAlarmWarningLine,
  RiHistoryLine,
  RiMessage3Line,
  RiRobot2Line,
  RiMapPinLine,
  RiMap2Line,
} from "react-icons/ri";

import { MdOutlineEmergency } from "react-icons/md";
import { BiMessageSquareDetail } from "react-icons/bi";

export const adminMenuItems = [
  {
    key: "dashboard",
    title: "Dashboard",
    icon: RiDashboardLine,
    gradient: "from-green-500 to-green-600",
    children: [
      {
        title: "Home",
        icon: RiDashboardLine,
        route: "/dashboard",
        key: "home",
      },
    ],
  },
  {
    key: "userManagement",
    title: "User Management",
    icon: RiUser3Line,
    gradient: "from-blue-500 to-purple-600",
    requiredRoles: ["admin", "manager"],
    children: [
      {
        title: "All Users",
        icon: RiUser3Line,
        route: "/user-management",
        key: "allUsers",
      },
    ],
  },
  {
    key: "departments",
    title: "Departments",
    icon: RiBuildingLine,
    gradient: "from-yellow-500 to-orange-600",
    requiredRoles: ["admin", "manager"],
    children: [
      {
        title: "All Departments",
        icon: RiBuildingLine,
        route: "/departments",
        key: "allDepartments",
      },
    ],
  },
  {
    key: "services",
    title: "Services",
    icon: RiStethoscopeLine,
    gradient: "from-teal-500 to-green-600",
    requiredRoles: ["admin", "manager"],
    children: [
      {
        title: "All Services",
        icon: RiClipboardLine,
        route: "/services",
        key: "allServices",
      },
    ],
  },
  {
    key: "analytics",
    title: "Analytics",
    icon: RiBarChartLine,
    gradient: "from-pink-500 to-red-600",
    requiredRoles: ["admin", "manager"],
    children: [
      {
        title: "System Analytics",
        icon: RiBarChartLine,
        route: "/analytics?type=system",
        key: "systemAnalytics",
      },
      {
        title: "User Analytics",
        icon: RiBarChartLine,
        route: "/analytics?type=users",
        key: "userAnalytics",
      },
      {
        title: "Department Analytics",
        icon: RiPieChartLine,
        route: "/analytics?type=departments",
        key: "departmentAnalytics",
      },
    ],
  },
  {
    key: "profile",
    title: "Profile",
    icon: RiUserLine,
    gradient: "from-indigo-500 to-blue-700",
    children: [
      {
        title: "My Profile",
        icon: RiUserLine,
        route: "/profile",
        key: "myProfile",
      },
    ],
  },
];

export const hodMenuItems = [
  {
    key: "dashboard",
    title: "Dashboard",
    icon: RiDashboardLine,
    gradient: "from-green-500 to-green-600",
    children: [{ title: "Home", icon: RiDashboardLine, route: "/dashboard", key: "home" }],
  },
  {
    key: "staffManagement",
    title: "Staff Management",
    icon: RiUser3Line,
    gradient: "from-blue-500 to-purple-600",
    children: [{ title: "Staff", icon: RiUserLine, route: "/staff", key: "staff" }],
  },
  {
    key: "analytics",
    title: "Analytics",
    icon: RiBarChartLine,
    gradient: "from-pink-500 to-red-600",
    children: [
      {
        title: "All appointments",
        icon: RiCalendarLine,
        route: "/appointments",
        requiredRoles: ["doctor", "nurse", "patient"], // ✅ fixed comma
        key: "appointments",
      },
    ],
  },
  {
    key: "enquiries",
    title: "Enquiries",
    icon: RiInboxLine,
    gradient: "from-yellow-500 to-orange-600",
    children: [
      { title: "All Enquiries", icon: RiMessage2Line, route: "/enquiries", key: "allEnquiries" },
    ],
  },
  {
    key: "profile",
    title: "Profile",
    icon: RiUserLine,
    gradient: "from-indigo-500 to-blue-700",
    children: [{ title: "My Profile", icon: RiUserLine, route: "/profile", key: "myProfile" }],
  },
];

export const staffMenuItems = [
  {
    key: "dashboard",
    title: "Dashboard",
    icon: RiDashboardLine,
    gradient: "from-green-500 to-green-600",
    children: [{ title: "Home", icon: RiDashboardLine, route: "/dashboard", key: "home" }],
  },
  {
    key: "emergencies",
    title: "Emergencies",
    icon: MdOutlineEmergency,
    gradient: "from-red-500 to-orange-600",
    children: [
      {
        title: "Active Emergency",
        icon: RiAlarmWarningLine,
        route: "/active-emergency",
        key: "activeEmergency",
      },
      {
        title: "Past Emergencies",
        icon: RiHistoryLine,
        route: "/past-emergencies",
        key: "pastEmergency",
      },
    ],
  },
  {
    key: "appointments",
    title: "Appointments",
    icon: RiCalendarLine,
    gradient: "from-blue-500 to-purple-600",
    children: [
      {
        title: "Pending",
        icon: RiCalendarLine,
        route: "/appointments?status=pending",
        key: "pendingAppointments",
      },
      {
        title: "Completed",
        icon: RiCalendarLine,
        route: "/appointments?status=completed",
        key: "completedAppointments",
      },
      {
        title: "Cancelled",
        icon: RiCalendarLine,
        route: "/appointments?status=cancelled",
        key: "cancelledAppointments",
      },
    ],
  },
  {
    key: "profile",
    title: "Profile",
    icon: RiUserLine,
    gradient: "from-indigo-500 to-blue-700",
    children: [{ title: "My Profile", icon: RiUserLine, route: "/profile", key: "myProfile" }],
  },
];

export const patientMenuItems = [
  {
    key: "dashboard",
    title: "Dashboard",
    icon: RiDashboardLine,
    gradient: "from-green-500 to-green-600",
    children: [
      {
        title: "Home",
        icon: RiDashboardLine,
        route: "/dashboard",
        key: "home",
      },
    ],
  },
  {
    key: "enquiries",
    title: "Enquiries",
    icon: RiMessage3Line,
    gradient: "from-blue-500 to-purple-600",
    children: [
      {
        title: "Wezi Bot",
        icon: RiRobot2Line,
        route: "/wezi-bot",
        key: "wezBot",
      },
      {
        title: "Enquiries",
        icon: BiMessageSquareDetail,
        route: "/enquiries",
        key: "enquiries",
      },
    ],
  },
  {
    key: "appointments",
    title: "Appointments",
    icon: RiCalendarLine,
    gradient: "from-blue-500 to-purple-600",
    children: [
      {
        title: "All Appointments",
        icon: RiCalendarLine,
        route: "/appointments",
        key: "appointments",
      },
    ],
  },
  {
    key: "emergencies",
    title: "Emergencies",
    icon: MdOutlineEmergency,
    gradient: "from-red-500 to-orange-600",
    children: [
      {
        title: "Active Emergency",
        icon: RiAlarmWarningLine,
        route: "/active-emergency",
        key: "activeEmergency",
      },
      {
        title: "Past Emergencies",
        icon: RiHistoryLine,
        route: "/past-emergencies",
        key: "pastEmergency",
      },
    ],
  },
  {
    key: "navigation",
    title: "Navigation",
    icon: RiMapPinLine,
    gradient: "from-green-500 to-teal-600",
    children: [
      {
        title: "Wezi Map",
        icon: RiMap2Line,
        route: "/wezi-virtual-map",
        key: "navigation",
      },
    ],
  },
  {
    key: "medicalRecords",
    title: "Medical Records",
    icon: RiClipboardLine,
    gradient: "from-teal-500 to-green-600",
    children: [
      {
        title: "My Records",
        icon: RiClipboardLine,
        route: "/records",
        key: "myRecords",
      },
    ],
  },
  {
    key: "profile",
    title: "Profile",
    icon: RiUserLine,
    gradient: "from-indigo-500 to-blue-700",
    children: [
      {
        title: "My Profile",
        icon: RiUserLine,
        route: "/profile",
        key: "myProfile",
      },
    ],
  },
];
