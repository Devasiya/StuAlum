const { Types } = require("mongoose");

// Example User IDs (must match existing users in your User collection)
const userIds = [
  new Types.ObjectId("6510a2b3f1d2a001f9f2001"),
  new Types.ObjectId("6510a2b3f1d2a001f9f2002"),
  new Types.ObjectId("6510a2b3f1d2a001f9f2003"),
  new Types.ObjectId("6510a2b3f1d2a001f9f2004"),
  new Types.ObjectId("6510a2b3f1d2a001f9f2005"),
  new Types.ObjectId("6510a2b3f1d2a001f9f2006"),
  new Types.ObjectId("6510a2b3f1d2a001f9f2007"),
  new Types.ObjectId("6510a2b3f1d2a001f9f2008"),
  new Types.ObjectId("6510a2b3f1d2a001f9f2009"),
  new Types.ObjectId("6510a2b3f1d2a001f9f2010")
];

const userCareers = [
  { user_id: userIds[0], current_role: "Software Intern", company_name: "Google", experience: "0-1 years", interests: ["AI", "Machine Learning"] },
  { user_id: userIds[1], current_role: "Backend Developer", company_name: "TCS", experience: "1-2 years", interests: ["Node.js", "Databases", "APIs"] },
  { user_id: userIds[2], current_role: "Frontend Developer", company_name: "Infosys", experience: "2-3 years", interests: ["React", "UI/UX", "JavaScript"] },
  { user_id: userIds[3], current_role: "Data Analyst", company_name: "Amazon", experience: "3-4 years", interests: ["SQL", "Python", "Data Visualization"] },
  { user_id: userIds[4], current_role: "Full Stack Developer", company_name: "Microsoft", experience: "2-3 years", interests: ["Node.js", "React", "Cloud"] },
  { user_id: userIds[5], current_role: "ML Engineer", company_name: "IBM", experience: "1-2 years", interests: ["Deep Learning", "Python", "TensorFlow"] },
  { user_id: userIds[6], current_role: "DevOps Engineer", company_name: "Accenture", experience: "3-4 years", interests: ["CI/CD", "AWS", "Kubernetes"] },
  { user_id: userIds[7], current_role: "System Architect", company_name: "Capgemini", experience: "4-5 years", interests: ["Microservices", "Architecture", "Design Patterns"] },
  { user_id: userIds[8], current_role: "Data Scientist", company_name: "Oracle", experience: "2-3 years", interests: ["Machine Learning", "R", "Python"] },
  { user_id: userIds[9], current_role: "Cloud Engineer", company_name: "Dell", experience: "1-2 years", interests: ["AWS", "Azure", "Terraform"] }
];

module.exports = userCareers;
