const { Types } = require("mongoose");

// Generate 5 example users dynamically
const userIds = [
  new Types.ObjectId(),
  new Types.ObjectId(),
  new Types.ObjectId(),
  new Types.ObjectId(),
  new Types.ObjectId()
];

const prepResources = [
  {
    _id: new Types.ObjectId(),
    title: "Data Structures in C++",
    type: "book",
    url: "https://example.com/ds-cpp",
    description: "Comprehensive guide on data structures using C++.",
    difficulty: "beginner",
    tags: ["C++", "data structures", "programming"],
    created_by: userIds[0],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: new Types.ObjectId(),
    title: "System Design Primer",
    type: "article",
    url: "https://example.com/system-design",
    description: "Step-by-step guide to preparing for system design interviews.",
    difficulty: "advanced",
    tags: ["system design", "architecture", "interview"],
    created_by: userIds[1],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: new Types.ObjectId(),
    title: "LeetCode 100 Must-Do Problems",
    type: "course",
    url: "https://example.com/leetcode-top-100",
    description: "Collection of the most popular coding problems for interviews.",
    difficulty: "intermediate",
    tags: ["algorithms", "leetcode", "practice"],
    created_by: userIds[2],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: new Types.ObjectId(),
    title: "Cracking the Coding Interview",
    type: "book",
    url: "https://example.com/ctci",
    description: "Classic book for coding interview preparation.",
    difficulty: "intermediate",
    tags: ["interview", "data structures", "algorithms"],
    created_by: userIds[3],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: new Types.ObjectId(),
    title: "Machine Learning Crash Course",
    type: "video",
    url: "https://example.com/ml-course",
    description: "Google’s ML crash course with exercises and notebooks.",
    difficulty: "beginner",
    tags: ["machine learning", "python", "AI"],
    created_by: userIds[4],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: new Types.ObjectId(),
    title: "Advanced SQL Queries",
    type: "article",
    url: "https://example.com/sql-advanced",
    description: "Guide to mastering SQL window functions and optimization.",
    difficulty: "advanced",
    tags: ["SQL", "databases", "backend"],
    created_by: userIds[0],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: new Types.ObjectId(),
    title: "Operating Systems Concepts",
    type: "book",
    url: "https://example.com/os-book",
    description: "Standard book for understanding operating system fundamentals.",
    difficulty: "intermediate",
    tags: ["OS", "computer science", "theory"],
    created_by: userIds[1],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: new Types.ObjectId(),
    title: "Git & GitHub Basics",
    type: "video",
    url: "https://example.com/git-basics",
    description: "A complete beginner’s tutorial on Git and GitHub.",
    difficulty: "beginner",
    tags: ["git", "github", "version control"],
    created_by: userIds[2],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: new Types.ObjectId(),
    title: "Deep Learning Specialization",
    type: "course",
    url: "https://example.com/dl-specialization",
    description: "Andrew Ng’s deep learning course series on Coursera.",
    difficulty: "advanced",
    tags: ["deep learning", "neural networks", "AI"],
    created_by: userIds[3],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: new Types.ObjectId(),
    title: "Time Complexity Cheatsheet",
    type: "article",
    url: "https://example.com/time-complexity",
    description: "Quick reference for Big-O complexities of common algorithms.",
    difficulty: "beginner",
    tags: ["algorithms", "complexity", "interview"],
    created_by: userIds[4],
    created_at: new Date(),
    updated_at: new Date()
  }
];

module.exports = prepResources;
