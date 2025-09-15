const { Types } = require("mongoose");

const contactRequestSamples = [
  {
    _id: new Types.ObjectId(),
    user_id: new Types.ObjectId(), // Registered user
    name: "Ravi Sharma",
    email: "ravi.sharma@example.com",
    subject: "Issue with login",
    message: "I am unable to log into my alumni account.",
    status: "open",
    response: null,
    resolved_at: null
  },
  {
    _id: new Types.ObjectId(),
    user_id: null, // Guest
    name: "Anita Desai",
    email: "anita.desai@example.com",
    subject: "Request for event details",
    message: "Can you share details about the Alumni Meet 2025?",
    status: "in_progress",
    response: "We are gathering details and will update soon.",
    resolved_at: null
  },
  {
    _id: new Types.ObjectId(),
    user_id: new Types.ObjectId(),
    name: "Suresh Iyer",
    email: "suresh.iyer@example.com",
    subject: "Update profile",
    message: "I want to update my current company details.",
    status: "resolved",
    response: "Your profile has been updated successfully.",
    resolved_at: new Date("2025-08-20")
  },
  {
    _id: new Types.ObjectId(),
    user_id: new Types.ObjectId(),
    name: "Meena Raghavan",
    email: "meena.raghavan@example.com",
    subject: "Verification request",
    message: "Please verify my alumni profile.",
    status: "open",
    response: null,
    resolved_at: null
  },
  {
    _id: new Types.ObjectId(),
    user_id: null,
    name: "Arjun Verma",
    email: "arjun.verma@example.com",
    subject: "Website feedback",
    message: "The signup page loads slowly. Please check.",
    status: "closed",
    response: "Issue acknowledged and fixed in the latest release.",
    resolved_at: new Date("2025-08-10")
  },
  {
    _id: new Types.ObjectId(),
    user_id: new Types.ObjectId(),
    name: "Priya Nair",
    email: "priya.nair@example.com",
    subject: "Mentorship program query",
    message: "How do I join as a mentor in the program?",
    status: "in_progress",
    response: "Our admin team will reach out with steps.",
    resolved_at: null
  },
  {
    _id: new Types.ObjectId(),
    user_id: new Types.ObjectId(),
    name: "Rohit Kapoor",
    email: "rohit.kapoor@example.com",
    subject: "Unable to register",
    message: "The registration form gives an error after submission.",
    status: "resolved",
    response: "Bug fixed. Please try again.",
    resolved_at: new Date("2025-08-28")
  },
  {
    _id: new Types.ObjectId(),
    user_id: null,
    name: "Sneha Gupta",
    email: "sneha.gupta@example.com",
    subject: "Event sponsorship",
    message: "I am interested in sponsoring the annual alumni meet.",
    status: "open",
    response: null,
    resolved_at: null
  },
  {
    _id: new Types.ObjectId(),
    user_id: new Types.ObjectId(),
    name: "Nikhil Menon",
    email: "nikhil.menon@example.com",
    subject: "Internship opportunities",
    message: "Do alumni provide internship opportunities to students?",
    status: "in_progress",
    response: "We are collecting data from alumni and will notify soon.",
    resolved_at: null
  },
  {
    _id: new Types.ObjectId(),
    user_id: new Types.ObjectId(),
    name: "Kavita Joshi",
    email: "kavita.joshi@example.com",
    subject: "Profile photo issue",
    message: "My profile photo is not updating.",
    status: "resolved",
    response: "Your photo issue has been fixed.",
    resolved_at: new Date("2025-09-05")
  }
];

module.exports = contactRequestSamples;
