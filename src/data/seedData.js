import { initDB, saveCourse, saveLesson, clearDB } from '../db/db';

export const initialCourses = [
  {
    id: 'c1',
    title: 'Class 8 Mathematics',
    description: 'Learn fundamental mathematics for Class 8.',
    subject: 'Mathematics',
    class: '8',
  },
  {
    id: 'c2',
    title: 'Class 8 Science',
    description: 'Explore the wonders of Science.',
    subject: 'Science',
    class: '8',
  },
  {
    id: 'c3',
    title: 'Class 8 English',
    description: 'Master English grammar and literature.',
    subject: 'English',
    class: '8',
  }
];

export const initialLessons = [
  {
    id: 'l1',
    courseId: 'c1',
    title: '1. Introduction to Linear Equations',
    description: 'Understand the basics of linear equations in one variable.',
    content: 'A linear equation is an algebraic equation in which each term is either a constant or the product of a constant and a single variable.',
    notes: 'Remember: The highest power of the variable in a linear equation is 1.',
    hasVideo: true,
    videoSize: '45 MB',
  },
  {
    id: 'l2',
    courseId: 'c1',
    title: '2. Algebra Basics',
    description: 'Revisit algebra basics.',
    content: 'Constants, variables, and coefficients.',
    notes: 'x is a variable, 5 is a constant.',
    hasVideo: false,
  },
  {
    id: 'l3',
    courseId: 'c1',
    title: '3. Linear Equations',
    description: 'Solving basic linear equations.',
    content: 'Solving for x: 2x = 10 -> x = 5.',
    notes: 'Always perform the same operation on both sides of the equation.',
    hasVideo: true,
    videoSize: '32 MB',
  },
  {
    id: 'l4',
    courseId: 'c1',
    title: '4. Practice Problems',
    description: 'Practice makes perfect.',
    content: 'Try solving: x + 4 = 10, 3x = 12.',
    notes: 'Take your time.',
    hasVideo: false,
  },
  {
    id: 'l5',
    courseId: 'c1',
    title: '5. Revision Quiz',
    description: 'Test your knowledge.',
    content: 'This lesson includes a quiz and a final review video.',
    notes: 'Good luck!',
    hasVideo: true,
    videoSize: '28 MB',
    quiz: {
      questions: [
        {
          id: 'q1',
          question: 'Solve for x: 2x + 4 = 10',
          options: ['x = 2', 'x = 3', 'x = 4', 'x = 6'],
          correctAnswer: 'x = 3'
        },
        {
          id: 'q2',
          question: 'What is the coefficient of x in 5x = 20?',
          options: ['x', '20', '5', '0'],
          correctAnswer: '5'
        },
        {
          id: 'q3',
          question: 'Solve for y: y - 7 = 14',
          options: ['y = 7', 'y = 21', 'y = 2', 'y = 14'],
          correctAnswer: 'y = 21'
        },
        {
          id: 'q4',
          question: 'Is 3x^2 = 12 a linear equation?',
          options: ['Yes', 'No'],
          correctAnswer: 'No'
        },
        {
          id: 'q5',
          question: 'Solve for z: z/2 = 8',
          options: ['z = 4', 'z = 10', 'z = 16', 'z = 6'],
          correctAnswer: 'z = 16'
        }
      ]
    }
  }
];

export const seedDatabase = async () => {
  const db = await initDB();
  const existingCourses = await db.getAll('courses');
  
  if (existingCourses.length === 0) {
    for (const course of initialCourses) {
      await saveCourse(course);
    }
    for (const lesson of initialLessons) {
      await saveLesson(lesson);
    }
    await db.put('settings', { key: 'student', value: { name: 'Ananya Kumar', class: '8', section: 'A' } });
    await db.put('settings', { key: 'teacher', value: { name: 'Priya Sharma', subject: 'Mathematics' } });
  }
};

export const resetDatabase = async () => {
  await clearDB();
  await seedDatabase();
};
