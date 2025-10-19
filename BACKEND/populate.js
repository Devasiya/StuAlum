const mongoose = require('mongoose');
const AlumniProfile = require('./models/AlumniProfile');
const StudentProfile = require('./models/StudentProfile');

mongoose.connect('mongodb://localhost:27017/StuAlum', {});

const sampleAlumni = [
  {
    email: 'john.doe@example.com',
    password: 'password123',
    full_name: 'John Doe',
    graduation_year: 2015,
    degree: 'B.Tech',
    current_position: 'Software Engineer',
    company: 'Google',
    industry: 'Technology',
    location: 'Mountain View, CA',
    skills: ['JavaScript', 'Python', 'Machine Learning'],
    linkedin_url: 'https://linkedin.com/in/johndoe',
    about_me: 'Experienced software engineer with a passion for mentoring.',
    profile_photo_url: '/default-avatar.png',
    is_verified: true,
    years_of_experience: 8,
    preferred_communication: ['Email', 'LinkedIn'],
    engagement_status: 'active',
    prospect_type: 'mentor'
  },
  {
    email: 'jane.smith@example.com',
    password: 'password123',
    full_name: 'Jane Smith',
    graduation_year: 2010,
    degree: 'M.Tech',
    current_position: 'Product Manager',
    company: 'Microsoft',
    industry: 'Technology',
    location: 'Seattle, WA',
    skills: ['Product Strategy', 'Agile', 'Leadership'],
    linkedin_url: 'https://linkedin.com/in/janesmith',
    about_me: 'Product manager helping teams build great products.',
    profile_photo_url: '/default-avatar.png',
    is_verified: true,
    years_of_experience: 12,
    preferred_communication: ['Email', 'Phone'],
    engagement_status: 'active',
    prospect_type: 'mentor'
  },
  {
    email: 'bob.johnson@example.com',
    password: 'password123',
    full_name: 'Bob Johnson',
    graduation_year: 2018,
    degree: 'B.Tech',
    current_position: 'Data Scientist',
    company: 'Amazon',
    industry: 'Technology',
    location: 'New York, NY',
    skills: ['Python', 'R', 'Data Analysis'],
    linkedin_url: 'https://linkedin.com/in/bobjohnson',
    about_me: 'Data scientist with expertise in AI and analytics.',
    profile_photo_url: '/default-avatar.png',
    is_verified: true,
    years_of_experience: 5,
    preferred_communication: ['Email'],
    engagement_status: 'active',
    prospect_type: 'mentor'
  },
  {
    email: 'alice.williams@example.com',
    password: 'password123',
    full_name: 'Alice Williams',
    graduation_year: 2012,
    degree: 'MBA',
    current_position: 'Engineering Manager',
    company: 'Facebook',
    industry: 'Technology',
    location: 'Menlo Park, CA',
    skills: ['Management', 'Java', 'Team Building'],
    linkedin_url: 'https://linkedin.com/in/alicewilliams',
    about_me: 'Engineering manager focused on team growth.',
    profile_photo_url: '/default-avatar.png',
    is_verified: true,
    years_of_experience: 10,
    preferred_communication: ['LinkedIn', 'Email'],
    engagement_status: 'active',
    prospect_type: 'mentor'
  },
  {
    email: 'charlie.brown@example.com',
    password: 'password123',
    full_name: 'Charlie Brown',
    graduation_year: 2016,
    degree: 'B.Tech',
    current_position: 'Senior Engineer',
    company: 'Netflix',
    industry: 'Technology',
    location: 'Los Angeles, CA',
    skills: ['C++', 'System Design', 'Distributed Systems'],
    linkedin_url: 'https://linkedin.com/in/charliebrown',
    about_me: 'Senior engineer specializing in scalable systems.',
    profile_photo_url: '/default-avatar.png',
    is_verified: true,
    years_of_experience: 7,
    preferred_communication: ['Email'],
    engagement_status: 'active',
    prospect_type: 'mentor'
  }
];

const sampleStudents = [
  {
    full_name: 'Student One',
    enrollment_number: 'EN001',
    email: 'student1@example.com',
    password: 'password123',
    branch: 'Computer Science',
    year_of_admission: 2020,
    year_of_graduation: 2024,
    contact_number: '1234567890',
    address: 'Some Address',
    skills: ['JavaScript', 'React'],
    career_goals: 'Become a full-stack developer',
    photo: '/default-avatar.png',
    is_verified: true
  },
  {
    full_name: 'Student Two',
    enrollment_number: 'EN002',
    email: 'student2@example.com',
    password: 'password123',
    branch: 'Information Technology',
    year_of_admission: 2019,
    year_of_graduation: 2023,
    contact_number: '0987654321',
    address: 'Another Address',
    skills: ['Python', 'Data Science'],
    career_goals: 'Work in AI and machine learning',
    photo: '/default-avatar.png',
    is_verified: true
  }
];

async function populate() {
  try {
    await AlumniProfile.insertMany(sampleAlumni);
    await StudentProfile.insertMany(sampleStudents);
    console.log('Sample data inserted successfully');
  } catch (err) {
    console.error('Error inserting data:', err);
  } finally {
    mongoose.connection.close();
  }
}

populate();
