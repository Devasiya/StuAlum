const { Types } = require("mongoose");

const events = [
  {
    _id: new Types.ObjectId(),
    title: "AI & Machine Learning Workshop",
    description: "Hands-on workshop covering ML basics with Python.",
    category: "workshop",
    audience: "students",
    location: "Room 302, CS Department",
    event_mode: "in_person",
    start_time: new Date("2025-10-05T10:00:00Z"),
    end_time: new Date("2025-10-05T16:00:00Z"),
    capacity: 80,
    status: "scheduled"
  },
  {
    _id: new Types.ObjectId(),
    title: "Alumni Mentorship Webinar",
    description: "Virtual panel where alumni share career advice.",
    category: "seminar",
    audience: "students",
    location: "Zoom Link",
    event_mode: "virtual",
    start_time: new Date("2025-10-10T14:00:00Z"),
    end_time: new Date("2025-10-10T16:00:00Z"),
    capacity: 500,
    status: "scheduled"
  },
  {
    _id: new Types.ObjectId(),
    title: "Annual Coding Hackathon",
    description: "24-hour hackathon with exciting prizes.",
    category: "competition",
    audience: "students",
    location: "Auditorium & Labs",
    event_mode: "in_person",
    start_time: new Date("2025-11-02T08:00:00Z"),
    end_time: new Date("2025-11-03T08:00:00Z"),
    capacity: 300,
    status: "scheduled"
  },
  {
    _id: new Types.ObjectId(),
    title: "Career Fair 2025",
    description: "Campus placements and company stalls for recruitment.",
    category: "placement",
    audience: "students",
    location: "Main Ground",
    event_mode: "in_person",
    start_time: new Date("2025-12-01T09:00:00Z"),
    end_time: new Date("2025-12-01T17:00:00Z"),
    capacity: 1000,
    status: "scheduled"
  },
  {
    _id: new Types.ObjectId(),
    title: "Leadership Talk by Dr. Ramesh Kumar",
    description: "Inspiring session on leadership in academia and industry.",
    category: "talk",
    audience: "all",
    location: "Conference Hall A",
    event_mode: "hybrid",
    start_time: new Date("2025-09-20T11:00:00Z"),
    end_time: new Date("2025-09-20T13:00:00Z"),
    capacity: 200,
    status: "scheduled"
  },
  {
    _id: new Types.ObjectId(),
    title: "Blockchain in Education",
    description: "Alumni-led seminar on blockchain applications in academics.",
    category: "seminar",
    audience: "students",
    location: "Seminar Hall B",
    event_mode: "in_person",
    start_time: new Date("2025-10-15T10:00:00Z"),
    end_time: new Date("2025-10-15T12:00:00Z"),
    capacity: 120,
    status: "scheduled"
  },
  {
    _id: new Types.ObjectId(),
    title: "Tech Startup Pitch Event",
    description: "Platform for students and alumni to pitch startup ideas.",
    category: "competition",
    audience: "all",
    location: "Innovation Center",
    event_mode: "hybrid",
    start_time: new Date("2025-11-12T09:00:00Z"),
    end_time: new Date("2025-11-12T18:00:00Z"),
    capacity: 250,
    status: "scheduled"
  },
  {
    _id: new Types.ObjectId(),
    title: "Women in Tech Virtual Meetup",
    description: "Celebrating women alumni and their journey in technology.",
    category: "talk",
    audience: "alumni",
    location: "Google Meet",
    event_mode: "virtual",
    start_time: new Date("2025-10-25T15:00:00Z"),
    end_time: new Date("2025-10-25T17:00:00Z"),
    capacity: 400,
    status: "scheduled"
  },
  {
    _id: new Types.ObjectId(),
    title: "Cybersecurity Awareness Drive",
    description: "Hands-on session with live demonstrations.",
    category: "workshop",
    audience: "students",
    location: "Lab 210, IT Department",
    event_mode: "in_person",
    start_time: new Date("2025-09-30T09:00:00Z"),
    end_time: new Date("2025-09-30T13:00:00Z"),
    capacity: 60,
    status: "scheduled"
  },
  {
    _id: new Types.ObjectId(),
    title: "Global Alumni Networking Evening",
    description: "Virtual networking session for alumni worldwide.",
    category: "seminar",
    audience: "alumni",
    location: "Microsoft Teams",
    event_mode: "virtual",
    start_time: new Date("2025-12-15T18:00:00Z"),
    end_time: new Date("2025-12-15T20:00:00Z"),
    capacity: 1000,
    status: "scheduled"
  }
];

module.exports = events;
