const { Types } = require("mongoose");

const mentorshipPreferences = [
  {
    _id: new Types.ObjectId(),
    user_id: new Types.ObjectId("650f1c2a3f1d2a001f9d1001"), // Student user
    industry: "Information Technology",
    role: "Software Engineer",
    skills: ["JavaScript", "React", "Node.js"],
    location: "Bangalore",
    availability: "2-3 hrs/week",
    alumni_year_range_start: 2015,
    alumni_year_range_end: 2020
  },
  {
    _id: new Types.ObjectId(),
    user_id: new Types.ObjectId("650f1c2a3f1d2a001f9d2001"), // Alumni mentor
    industry: "Data Science",
    role: "Data Scientist",
    skills: ["Python", "Machine Learning", "SQL"],
    location: "Hyderabad",
    availability: "1-2 hrs/week",
    alumni_year_range_start: 2010,
    alumni_year_range_end: 2014
  },
  {
    _id: new Types.ObjectId(),
    user_id: new Types.ObjectId("650f1c2a3f1d2a001f9d1002"),
    industry: "Human Resources",
    role: "HR Manager",
    skills: ["Recruitment", "Employee Engagement"],
    location: "Mumbai",
    availability: "Flexible",
    alumni_year_range_start: 2008,
    alumni_year_range_end: 2015
  },
  {
    _id: new Types.ObjectId(),
    user_id: new Types.ObjectId("650f1c2a3f1d2a001f9d2002"),
    industry: "Cybersecurity",
    role: "Security Analyst",
    skills: ["Network Security", "Penetration Testing", "Risk Management"],
    location: "Delhi",
    availability: "1 hr/week",
    alumni_year_range_start: 2012,
    alumni_year_range_end: 2018
  },
  {
    _id: new Types.ObjectId(),
    user_id: new Types.ObjectId("650f1c2a3f1d2a001f9d1003"),
    industry: "Academia",
    role: "Research Scholar",
    skills: ["Deep Learning", "NLP", "Research Writing"],
    location: "Chennai",
    availability: "3-4 hrs/week",
    alumni_year_range_start: 2016,
    alumni_year_range_end: 2022
  },
  {
    _id: new Types.ObjectId(),
    user_id: new Types.ObjectId("650f1c2a3f1d2a001f9d2003"),
    industry: "Startups",
    role: "Founder",
    skills: ["Entrepreneurship", "Fundraising", "Product Development"],
    location: "Pune",
    availability: "2 hrs/week",
    alumni_year_range_start: 2005,
    alumni_year_range_end: 2012
  },
  {
    _id: new Types.ObjectId(),
    user_id: new Types.ObjectId("650f1c2a3f1d2a001f9d1004"),
    industry: "Cloud Computing",
    role: "Cloud Engineer",
    skills: ["AWS", "Azure", "DevOps"],
    location: "Remote",
    availability: "Flexible",
    alumni_year_range_start: 2013,
    alumni_year_range_end: 2018
  },
  {
    _id: new Types.ObjectId(),
    user_id: new Types.ObjectId("650f1c2a3f1d2a001f9d2004"),
    industry: "Artificial Intelligence",
    role: "AI Researcher",
    skills: ["Computer Vision", "TensorFlow", "PyTorch"],
    location: "Bangalore",
    availability: "1-2 hrs/week",
    alumni_year_range_start: 2010,
    alumni_year_range_end: 2016
  },
  {
    _id: new Types.ObjectId(),
    user_id: new Types.ObjectId("650f1c2a3f1d2a001f9d1005"),
    industry: "Embedded Systems",
    role: "Embedded Developer",
    skills: ["C", "C++", "Microcontrollers"],
    location: "Kolkata",
    availability: "2 hrs/week",
    alumni_year_range_start: 2014,
    alumni_year_range_end: 2019
  },
  {
    _id: new Types.ObjectId(),
    user_id: new Types.ObjectId("650f1c2a3f1d2a001f9d2005"),
    industry: "Web Development",
    role: "Full Stack Developer",
    skills: ["JavaScript", "MongoDB", "Express", "React"],
    location: "Remote",
    availability: "3 hrs/week",
    alumni_year_range_start: 2009,
    alumni_year_range_end: 2015
  }
];

module.exports = mentorshipPreferences;
