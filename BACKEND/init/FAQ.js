const { Types } = require("mongoose");

const faqs = [
  {
    _id: new Types.ObjectId(),
    question: "How can I register as an alumni on the platform?",
    answer: "To register, click on the 'Sign Up' button, choose Alumni, and fill in your graduation year, degree, and contact details.",
    category: "Registration",
    is_active: true
  },
  {
    _id: new Types.ObjectId(),
    question: "Can current students connect with alumni for mentorship?",
    answer: "Yes, students can send mentorship requests to verified alumni profiles through the 'Connect' feature.",
    category: "Mentorship",
    is_active: true
  },
  {
    _id: new Types.ObjectId(),
    question: "How do I update my profile details?",
    answer: "Navigate to your profile settings and edit your details such as current position, skills, and contact number.",
    category: "Profile Management",
    is_active: true
  },
  {
    _id: new Types.ObjectId(),
    question: "Are events open to both students and alumni?",
    answer: "Most events are open to all, but some may be restricted to specific audiences as mentioned in the event details.",
    category: "Events",
    is_active: true
  },
  {
    _id: new Types.ObjectId(),
    question: "How do I participate in campus placement drives?",
    answer: "Placement drives are listed under Events. Eligible students can register online before the event deadline.",
    category: "Placement",
    is_active: true
  },
  {
    _id: new Types.ObjectId(),
    question: "Can I contribute as a speaker for college events?",
    answer: "Yes, alumni can apply as speakers by selecting the 'Contribution Preferences' option in their profile.",
    category: "Alumni Contribution",
    is_active: true
  },
  {
    _id: new Types.ObjectId(),
    question: "What should I do if I forget my account password?",
    answer: "Click on 'Forgot Password' on the login page, and follow the email instructions to reset your password.",
    category: "Account",
    is_active: true
  },
  {
    _id: new Types.ObjectId(),
    question: "Is my data secure on this platform?",
    answer: "Yes, all user data and interactions are stored securely and managed with blockchain for transparency.",
    category: "Security",
    is_active: true
  },
  {
    _id: new Types.ObjectId(),
    question: "How do I report an issue or contact support?",
    answer: "You can submit a support request through the 'Contact Us' page, and our admin team will respond promptly.",
    category: "Support",
    is_active: true
  },
  {
    _id: new Types.ObjectId(),
    question: "Can I deactivate my profile temporarily?",
    answer: "Yes, go to your profile settings and choose 'Deactivate Account' to pause visibility without deleting data.",
    category: "Profile Management",
    is_active: true
  }
];

module.exports = faqs;
