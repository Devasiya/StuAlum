const { Types } = require("mongoose");

const adminProfiles = [
  {
    _id: new Types.ObjectId(),
    user_id: new Types.ObjectId("64b1a1c11111111111111111"), // same User ID in Users collection
    full_name: "Dr. Ramesh Kumar",
    designation: "Principal",
    department: "Administration",
    contact_office: "080-28467001",
    admin_level: "super-admin",
    permissions: { edit_user: true, manage_events: true }
  },
  {
    _id: new Types.ObjectId(),
    user_id: new Types.ObjectId("64b1a1c12222222222222222"),
    full_name: "Prof. Anjali Mehta",
    designation: "Dean of Academics",
    department: "Computer Science",
    contact_office: "080-23600834",
    admin_level: "admin",
    permissions: { edit_user: true, manage_events: true }
  },
  {
    _id: new Types.ObjectId(),
    user_id: new Types.ObjectId("64b1a1c13333333333333333"),
    full_name: "Dr. Vivek Narayan",
    designation: "Head of Department",
    department: "Electronics & Communication",
    contact_office: "080-28600123",
    admin_level: "admin",
    permissions: { edit_user: true, manage_events: false }
  },
  {
    _id: new Types.ObjectId(),
    user_id: new Types.ObjectId("64b1a1c14444444444444444"),
    full_name: "Dr. Sneha Raghavan",
    designation: "Registrar",
    department: "Administration",
    contact_office: "080-26721983",
    admin_level: "super-admin",
    permissions: { edit_user: true, manage_events: true }
  },
  {
    _id: new Types.ObjectId(),
    user_id: new Types.ObjectId("64b1a1c15555555555555555"),
    full_name: "Prof. Manjunath Gowda",
    designation: "Dean of Student Affairs",
    department: "Mechanical Engineering",
    contact_office: "080-42161991",
    admin_level: "admin",
    permissions: { edit_user: false, manage_events: true }
  },
  {
    _id: new Types.ObjectId(),
    user_id: new Types.ObjectId("64b1a1c16666666666666666"),
    full_name: "Dr. Priya Menon",
    designation: "Head of Research",
    department: "Information Science",
    contact_office: "080-22161900",
    admin_level: "admin",
    permissions: { edit_user: true, manage_events: false }
  },
  {
    _id: new Types.ObjectId(),
    user_id: new Types.ObjectId("64b1a1c17777777777777777"),
    full_name: "Prof. Rajeshwari Hegde",
    designation: "Dean of Engineering",
    department: "Civil Engineering",
    contact_office: "080-40121900",
    admin_level: "super-admin",
    permissions: { edit_user: true, manage_events: true }
  },
  {
    _id: new Types.ObjectId(),
    user_id: new Types.ObjectId("64b1a1c18888888888888888"),
    full_name: "Dr. Karthik Subramanian",
    designation: "Head of Department",
    department: "Computer Applications",
    contact_office: "080-22991900",
    admin_level: "admin",
    permissions: { edit_user: true, manage_events: true }
  },
  {
    _id: new Types.ObjectId(),
    user_id: new Types.ObjectId("64b1a1c19999999999999999"),
    full_name: "Prof. Deepa Sharma",
    designation: "Dean of Placement",
    department: "Training & Placement",
    contact_office: "080-22481900",
    admin_level: "admin",
    permissions: { edit_user: false, manage_events: true }
  },
  {
    _id: new Types.ObjectId(),
    user_id: new Types.ObjectId("64b1a1c1aaaaaaaaaaaaaaaa"),
    full_name: "Dr. Harish Bhat",
    designation: "Registrar",
    department: "Administration",
    contact_office: "080-28391900",
    admin_level: "super-admin",
    permissions: { edit_user: true, manage_events: true }
  }
];

module.exports = adminProfiles;
