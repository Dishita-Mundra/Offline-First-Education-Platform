const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Course = require('./models/Course');
const Lesson = require('./models/Lesson');
const Quiz = require('./models/Quiz');
const Resource = require('./models/Resource');
const Enrollment = require('./models/Enrollment');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ias-school');
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const importData = async () => {
  await connectDB();
  try {
    console.log('Clearing old data...');
    // Only clear if needed, or maybe just look up and replace
    // Let's create specific users
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('123456', salt);

    // Create Teacher
    let teacher = await User.findOne({ schoolId: 'IAST001' });
    if (!teacher) {
      teacher = await User.create({
        name: 'Priya Sharma',
        schoolId: 'IAST001',
        password,
        role: 'teacher'
      });
      console.log('Teacher created');
    }

    // Create Students
    let student1 = await User.findOne({ schoolId: 'IAS8A001' });
    if (!student1) {
      student1 = await User.create({
        name: 'Ananya Kumar',
        schoolId: 'IAS8A001',
        password,
        role: 'student',
        class: '8',
        section: 'A'
      });
      console.log('Student 1 created');
    }

    let student2 = await User.findOne({ schoolId: 'IAS8A002' });
    if (!student2) {
      student2 = await User.create({
        name: 'Rahul Sharma',
        schoolId: 'IAS8A002',
        password,
        role: 'student',
        class: '8',
        section: 'A'
      });
      console.log('Student 2 created');
    }

    // Create Course
    let course = await Course.findOne({ title: 'Linear Equations' });
    if (!course) {
      course = await Course.create({
        title: 'Linear Equations',
        subject: 'Mathematics',
        class: '8',
        section: 'A',
        description: 'Learn the fundamentals of Linear Equations in One Variable.',
        teacherId: teacher._id,
        status: 'published',
        published: true
      });
      console.log('Course created');

      // Create Lessons
      const lesson1 = await Lesson.create({
        courseId: course._id,
        chapter: 'Introduction',
        title: 'Introduction to Linear Equations',
        description: 'Basic concepts of algebraic expressions and equations.',
        notesContent: 'An algebraic equation is an equality involving variables. It has an equality sign. The expression on the left of the equality sign is the Left Hand Side (LHS). The expression on the right of the equality sign is the Right Hand Side (RHS).',
        order: 1
      });

      const lesson2 = await Lesson.create({
        courseId: course._id,
        chapter: 'Solving',
        title: 'Solving Equations which have Linear Expressions on one Side',
        description: 'How to solve simple linear equations.',
        notesContent: 'To solve an equation, we perform the same mathematical operations on both sides of the equality sign. For example, to solve 2y + 9 = 4, subtract 9 from both sides.',
        order: 2
      });

      const lesson3 = await Lesson.create({
        courseId: course._id,
        chapter: 'Applications',
        title: 'Some Applications of Linear Equations',
        description: 'Word problems involving linear equations.',
        notesContent: 'We can use linear equations to solve real-world word problems. Identify the unknown, represent it with a variable, form an equation, and solve for the variable.',
        order: 3
      });

      // Create Resource
      const resource = await Resource.create({
        courseId: course._id,
        lessonId: lesson1._id,
        teacherId: teacher._id,
        fileName: 'Linear Equations Worksheet.pdf',
        fileType: 'application/pdf',
        fileSize: 1024000,
        fileUrl: '/uploads/sample-worksheet.pdf'
      });

      // Create Quiz
      const quiz = await Quiz.create({
        courseId: course._id,
        teacherId: teacher._id,
        title: 'Linear Equations Mastery Quiz',
        description: 'Test your knowledge on solving linear equations.',
        timeLimit: 15,
        passingScore: 60,
        status: 'published',
        published: true,
        questions: [
          {
            question: 'What is the solution of 2x - 3 = 7?',
            options: ['x = 2', 'x = 4', 'x = 5', 'x = 10'],
            correctAnswer: 'x = 5',
            explanation: 'Add 3 to both sides: 2x = 10. Divide by 2: x = 5.',
            marks: 1
          },
          {
            question: 'If 8x = 24, what is the value of x?',
            options: ['2', '3', '4', '8'],
            correctAnswer: '3',
            explanation: 'Divide both sides by 8: x = 24/8 = 3.',
            marks: 1
          },
          {
            question: 'Which of the following is a linear equation in one variable?',
            options: ['2x + 3y = 5', 'x^2 + 1 = 5', '3x - 4 = 11', 'xy = 4'],
            correctAnswer: '3x - 4 = 11',
            explanation: 'It has only one variable (x) and the highest power of the variable is 1.',
            marks: 1
          },
          {
            question: 'Solve for y: y/3 + 5 = 8',
            options: ['3', '6', '9', '12'],
            correctAnswer: '9',
            explanation: 'Subtract 5 from both sides: y/3 = 3. Multiply by 3: y = 9.',
            marks: 1
          },
          {
            question: 'Sum of two numbers is 95. If one exceeds the other by 15, find the smaller number.',
            options: ['30', '40', '45', '50'],
            correctAnswer: '40',
            explanation: 'Let smaller number be x. Larger number = x + 15. x + x + 15 = 95 => 2x = 80 => x = 40.',
            marks: 1
          }
        ]
      });

      console.log('Course content created');

      // Create Enrollments
      await Enrollment.create({
        studentId: student1._id,
        courseId: course._id,
        status: 'active'
      });

      await Enrollment.create({
        studentId: student2._id,
        courseId: course._id,
        status: 'active'
      });
      console.log('Students enrolled');

    }

    console.log('Demo Data Imported!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();
