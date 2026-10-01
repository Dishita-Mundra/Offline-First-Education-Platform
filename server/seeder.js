const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Course = require('./models/Course');
const Lesson = require('./models/Lesson');
const Enrollment = require('./models/Enrollment');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const seedData = async () => {
  try {
    await User.deleteMany();
    await Course.deleteMany();
    await Lesson.deleteMany();
    await Enrollment.deleteMany();

    const createdUsers = [];
    for (const userData of [
      {
        schoolId: 'IAST001',
        name: 'Priya Sharma',
        passwordHash: 'Teacher@123',
        role: 'teacher',
      },
      {
        schoolId: 'IAS8A001',
        name: 'Ananya Kumar',
        passwordHash: 'Student@123',
        role: 'student',
        class: '8',
        section: 'A'
      },
      {
        schoolId: 'IAS8A002',
        name: 'Rahul Sharma',
        passwordHash: 'Student@123',
        role: 'student',
        class: '8',
        section: 'A'
      }
    ]) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }

    const teacherId = createdUsers[0]._id;
    const student1Id = createdUsers[1]._id;
    const student2Id = createdUsers[2]._id;

    // Seed Courses
    const createdCourses = await Course.insertMany([
      {
        title: 'Class 8 Mathematics - Linear Equations',
        subject: 'Mathematics',
        class: '8',
        description: 'Learn fundamental mathematics for Class 8 including Linear Equations in one variable.',
        teacherId: teacherId,
        published: true
      },
      {
        title: 'Class 8 Science - Physics',
        subject: 'Science',
        class: '8',
        description: 'Explore the wonders of Science.',
        teacherId: teacherId,
        published: true
      }
    ]);

    // Seed Enrollments
    await Enrollment.insertMany([
      {
        studentId: student1Id,
        courseId: createdCourses[0]._id,
        status: 'active'
      },
      {
        studentId: student1Id,
        courseId: createdCourses[1]._id,
        status: 'active'
      },
      {
        studentId: student2Id,
        courseId: createdCourses[0]._id,
        status: 'active'
      }
    ]);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Course.deleteMany();
    await Lesson.deleteMany();
    await Enrollment.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  seedData();
}
