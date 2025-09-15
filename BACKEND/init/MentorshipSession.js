const { Types } = require("mongoose");

const mentorshipSessions = [
  {
    _id: new Types.ObjectId(),
    match_id: new Types.ObjectId(),
    scheduled_time: new Date("2025-09-20T10:00:00Z"),
    duration: 60,
    mode: "virtual",
    topic: "Resume Review & Career Planning",
    status: "upcoming"
  },
  {
    _id: new Types.ObjectId(),
    match_id: new Types.ObjectId(),
    scheduled_time: new Date("2025-09-10T15:30:00Z"),
    duration: 45,
    mode: "in_person",
    topic: "Data Structures Mock Interview",
    status: "completed"
  },
  {
    _id: new Types.ObjectId(),
    match_id: new Types.ObjectId(),
    scheduled_time: new Date("2025-09-25T08:00:00Z"),
    duration: 30,
    mode: "virtual",
    topic: "Exploring AI Career Paths",
    status: "upcoming"
  },
  {
    _id: new Types.ObjectId(),
    match_id: new Types.ObjectId(),
    scheduled_time: new Date("2025-09-12T12:00:00Z"),
    duration: 90,
    mode: "hybrid",
    topic: "Leadership Skills Workshop",
    status: "completed"
  },
  {
    _id: new Types.ObjectId(),
    match_id: new Types.ObjectId(),
    scheduled_time: new Date("2025-09-22T17:00:00Z"),
    duration: 60,
    mode: "virtual",
    topic: "Preparing for Tech Placements",
    status: "upcoming"
  },
  {
    _id: new Types.ObjectId(),
    match_id: new Types.ObjectId(),
    scheduled_time: new Date("2025-09-05T11:00:00Z"),
    duration: 40,
    mode: "virtual",
    topic: "Personal Branding on LinkedIn",
    status: "completed"
  },
  {
    _id: new Types.ObjectId(),
    match_id: new Types.ObjectId(),
    scheduled_time: new Date("2025-09-28T14:30:00Z"),
    duration: 50,
    mode: "in_person",
    topic: "Entrepreneurship 101",
    status: "upcoming"
  },
  {
    _id: new Types.ObjectId(),
    match_id: new Types.ObjectId(),
    scheduled_time: new Date("2025-09-15T16:00:00Z"),
    duration: 60,
    mode: "virtual",
    topic: "Advanced System Design",
    status: "rescheduled"
  },
  {
    _id: new Types.ObjectId(),
    match_id: new Types.ObjectId(),
    scheduled_time: new Date("2025-09-07T09:30:00Z"),
    duration: 30,
    mode: "hybrid",
    topic: "Effective Communication in Tech Teams",
    status: "completed"
  },
  {
    _id: new Types.ObjectId(),
    match_id: new Types.ObjectId(),
    scheduled_time: new Date("2025-09-18T18:00:00Z"),
    duration: 75,
    mode: "virtual",
    topic: "Cloud Computing Career Roadmap",
    status: "cancelled"
  }
];

module.exports = mentorshipSessions;
