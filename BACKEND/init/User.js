const { Types } = require("mongoose");
const bcrypt = require("bcryptjs"); // for hashing passwords

// Generate hashed passwords (for demo purposes)
const hashPassword = (password) => bcrypt.hashSync(password, 10);

const users = [
  {
    _id: new Types.ObjectId(),
    email: "raja.reddy@example.com",
    password_hash: hashPassword("password123"),
    role: "student",
    is_verified: true,
    profile_status: "complete",
    auth_provider: "local",
    created_at: new Date("2025-01-01T10:00:00Z"),
    updated_at: new Date("2025-01-01T10:00:00Z")
  },
  {
    _id: new Types.ObjectId(),
    email: "sneha.sharma@example.com",
    password_hash: hashPassword("password123"),
    role: "student",
    is_verified: true,
    profile_status: "complete",
    auth_provider: "local",
    created_at: new Date("2025-01-02T10:30:00Z"),
    updated_at: new Date("2025-01-02T10:30:00Z")
  },
  {
    _id: new Types.ObjectId(),
    email: "arjun.patel@example.com",
    password_hash: hashPassword("password123"),
    role: "student",
    is_verified: false,
    profile_status: "incomplete",
    auth_provider: "local",
    created_at: new Date("2025-01-03T11:00:00Z"),
    updated_at: new Date("2025-01-03T11:00:00Z")
  },
  {
    _id: new Types.ObjectId(),
    email: "meera.iyer@example.com",
    password_hash: hashPassword("password123"),
    role: "student",
    is_verified: true,
    profile_status: "complete",
    auth_provider: "local",
    created_at: new Date("2025-01-04T11:30:00Z"),
    updated_at: new Date("2025-01-04T11:30:00Z")
  },
  {
    _id: new Types.ObjectId(),
    email: "karan.verma@example.com",
    password_hash: hashPassword("password123"),
    role: "student",
    is_verified: true,
    profile_status: "complete",
    auth_provider: "local",
    created_at: new Date("2025-01-05T12:00:00Z"),
    updated_at: new Date("2025-01-05T12:00:00Z")
  },
  {
    _id: new Types.ObjectId(),
    email: "ananya.gupta@example.com",
    password_hash: hashPassword("password123"),
    role: "student",
    is_verified: false,
    profile_status: "incomplete",
    auth_provider: "local",
    created_at: new Date("2025-01-06T12:30:00Z"),
    updated_at: new Date("2025-01-06T12:30:00Z")
  },
  {
    _id: new Types.ObjectId(),
    email: "vikram.singh@example.com",
    password_hash: hashPassword("password123"),
    role: "student",
    is_verified: true,
    profile_status: "complete",
    auth_provider: "local",
    created_at: new Date("2025-01-07T13:00:00Z"),
    updated_at: new Date("2025-01-07T13:00:00Z")
  },
  {
    _id: new Types.ObjectId(),
    email: "priya.ramesh@example.com",
    password_hash: hashPassword("password123"),
    role: "student",
    is_verified: true,
    profile_status: "complete",
    auth_provider: "local",
    created_at: new Date("2025-01-08T13:30:00Z"),
    updated_at: new Date("2025-01-08T13:30:00Z")
  },
  {
    _id: new Types.ObjectId(),
    email: "rohan.mehta@example.com",
    password_hash: hashPassword("password123"),
    role: "student",
    is_verified: false,
    profile_status: "incomplete",
    auth_provider: "local",
    created_at: new Date("2025-01-09T14:00:00Z"),
    updated_at: new Date("2025-01-09T14:00:00Z")
  },
  {
    _id: new Types.ObjectId(),
    email: "sakshi.jain@example.com",
    password_hash: hashPassword("password123"),
    role: "student",
    is_verified: true,
    profile_status: "complete",
    auth_provider: "local",
    created_at: new Date("2025-01-10T14:30:00Z"),
    updated_at: new Date("2025-01-10T14:30:00Z")
  }
];

module.exports = users;
