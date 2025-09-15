const { Types } = require("mongoose");

const forumCategories = [
  {
    _id: new Types.ObjectId(),
    title: "Career Guidance",
    description: "Discussions on job search strategies, interview preparation, and industry insights for students and alumni."
  },
  {
    _id: new Types.ObjectId(),
    title: "Higher Education",
    description: "Talks about pursuing master's, PhDs, and international education opportunities."
  },
  {
    _id: new Types.ObjectId(),
    title: "Placements & Internships",
    description: "Dedicated space for placement-related queries, internship opportunities, and recruiter connections."
  },
  {
    _id: new Types.ObjectId(),
    title: "Entrepreneurship & Startups",
    description: "For budding entrepreneurs to share ideas, seek mentorship, and discuss startup ecosystems."
  },
  {
    _id: new Types.ObjectId(),
    title: "Tech Discussions",
    description: "Topics on AI, machine learning, software development, and new-age technologies."
  },
  {
    _id: new Types.ObjectId(),
    title: "Civil Services & Government Exams",
    description: "Guidance and peer discussions for UPSC, SSC, and other competitive government exams."
  },
  {
    _id: new Types.ObjectId(),
    title: "Alumni Networking",
    description: "Connect with batchmates and seniors, plan reunions, and build professional connections."
  },
  {
    _id: new Types.ObjectId(),
    title: "Research & Publications",
    description: "Share research work, academic papers, and collaborate on new research opportunities."
  },
  {
    _id: new Types.ObjectId(),
    title: "Events & Workshops",
    description: "Announcements and discussions around upcoming seminars, workshops, and competitions."
  },
  {
    _id: new Types.ObjectId(),
    title: "General Discussion",
    description: "Open space for any topic not covered in other categories."
  }
];

module.exports = forumCategories;
