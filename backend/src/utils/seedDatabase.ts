// import { faker } from '@faker-js/faker';
// import bcrypt from 'bcrypt';
// // import { sequelize, User, Teacher, Student, Course, Venue } from '../models';
// import logger from './logger';

// const departments = [
//   'Computer Science',
//   'Mechanical Engineering',
//   'Electrical Engineering',
//   'Biology',
//   'Mathematics',
//   'Physics',
//   'Economics',
//   'Psychology',
//   'Business Administration',
//   'Medicine',
//   'Mass Communication',
//   'Nursing',
//   'Industrial Chemistry',
//   'Microbiology',
// ];

// async function generateTeachers(count: number) {
//   const teachers = [];

//   for (let i = 0; i < count; i++) {
//     const firstName = faker.person.firstName();
//     const lastName = faker.person.lastName();
//     const email = faker.internet.email({
//       firstName,
//       lastName,
//       provider: 'calebuniversity.edu.ng',
//     });
//     const role = 'teacher';

//     const passwordHash = await bcrypt.hash('password', 10);
//     const department = faker.helpers.arrayElement(departments);

//     const user = await User.create({
//       firstName,
//       lastName,
//       email: email.toLowerCase(),
//       role,
//       passwordHash,
//     });

//     const teacher = await Teacher.create({
//       id: user.id,
//       department,
//     });
//   }
// }

// async function generateCourses() {
//   const courses = [
//     {
//       code: 'CS101',
//       title: 'Introduction to Computer Science',
//       desc: 'Fundamental concepts of computing, algorithms, and programming.',
//     },
//     {
//       code: 'CS102',
//       title: 'Programming in Python',
//       desc: 'Covers Python syntax, data structures, and problem-solving techniques.',
//     },
//     {
//       code: 'CS202',
//       title: 'Data Structures and Algorithms',
//       desc: 'Explores arrays, linked lists, trees, and sorting/searching algorithms.',
//     },
//     {
//       code: 'CS303',
//       title: 'Operating Systems',
//       desc: 'Covers process management, memory management, and file systems.',
//     },
//     {
//       code: 'CS305',
//       title: 'Computer Networks',
//       desc: 'Introduces networking fundamentals, TCP/IP, and protocols.',
//     },
//     {
//       code: 'CS310',
//       title: 'Database Management Systems',
//       desc: 'SQL, NoSQL, and relational database design.',
//     },
//     {
//       code: 'CS315',
//       title: 'Web Development',
//       desc: 'Front-end and back-end development with modern frameworks.',
//     },
//     {
//       code: 'CS320',
//       title: 'Software Engineering',
//       desc: 'Software design principles, testing, and project management.',
//     },
//     {
//       code: 'CS330',
//       title: 'Artificial Intelligence',
//       desc: 'Covers machine learning, neural networks, and AI applications.',
//     },
//     {
//       code: 'CS340',
//       title: 'Cybersecurity',
//       desc: 'Concepts of encryption, authentication, and network security.',
//     },
//     {
//       code: 'CS350',
//       title: 'Cloud Computing',
//       desc: 'Introduction to AWS, Azure, and Google Cloud services.',
//     },
//     {
//       code: 'CS360',
//       title: 'Game Development',
//       desc: 'Covers Unity, Unreal Engine, and game design principles.',
//     },
//     {
//       code: 'CS370',
//       title: 'Blockchain Technology',
//       desc: 'Explores blockchain concepts, smart contracts, and cryptography.',
//     },
//     {
//       code: 'MATH101',
//       title: 'Calculus I',
//       desc: 'Limits, derivatives, integrals, and applications.',
//     },
//     {
//       code: 'MATH102',
//       title: 'Calculus II',
//       desc: 'Advanced integration techniques and series.',
//     },
//     {
//       code: 'MATH201',
//       title: 'Discrete Mathematics',
//       desc: 'Logic, set theory, and combinatorics.',
//     },
//     {
//       code: 'MATH205',
//       title: 'Linear Algebra',
//       desc: 'Vectors, matrices, and eigenvalues.',
//     },
//     {
//       code: 'MATH210',
//       title: 'Statistics and Probability',
//       desc: 'Basic statistical analysis and probability distributions.',
//     },
//     {
//       code: 'PHY101',
//       title: 'General Physics I',
//       desc: 'Mechanics, motion, and energy principles.',
//     },
//     {
//       code: 'PHY102',
//       title: 'General Physics II',
//       desc: 'Electricity, magnetism, and optics.',
//     },
//     {
//       code: 'BIO101',
//       title: 'Introduction to Biology',
//       desc: 'Cell biology, genetics, and ecosystems.',
//     },
//     {
//       code: 'BIO150',
//       title: 'Human Anatomy',
//       desc: 'Structure and function of the human body.',
//     },
//     {
//       code: 'BIO200',
//       title: 'Molecular Biology',
//       desc: 'DNA, RNA, and protein synthesis.',
//     },
//     {
//       code: 'CHEM101',
//       title: 'General Chemistry I',
//       desc: 'Chemical reactions, atomic structure, and bonding.',
//     },
//     {
//       code: 'CHEM102',
//       title: 'General Chemistry II',
//       desc: 'Thermochemistry, kinetics, and equilibrium.',
//     },
//     {
//       code: 'CHEM201',
//       title: 'Organic Chemistry',
//       desc: 'Structure, reactions, and synthesis of organic compounds.',
//     },
//     {
//       code: 'ENG110',
//       title: 'Academic Writing',
//       desc: 'Writing essays, research papers, and critical analysis.',
//     },
//     {
//       code: 'ENG120',
//       title: 'Technical Communication',
//       desc: 'Writing technical reports, proposals, and presentations.',
//     },
//     {
//       code: 'HIST201',
//       title: 'World History',
//       desc: 'Major historical events from ancient to modern times.',
//     },
//     {
//       code: 'HIST220',
//       title: 'History of Science',
//       desc: 'Evolution of scientific discoveries and technological advancements.',
//     },
//     {
//       code: 'PSY101',
//       title: 'Introduction to Psychology',
//       desc: 'Fundamentals of human behavior and mental processes.',
//     },
//     {
//       code: 'PSY200',
//       title: 'Cognitive Psychology',
//       desc: 'Study of perception, memory, and decision-making.',
//     },
//     {
//       code: 'SOC101',
//       title: 'Introduction to Sociology',
//       desc: 'Societal structures, culture, and human interactions.',
//     },
//     {
//       code: 'ECON101',
//       title: 'Principles of Macroeconomics',
//       desc: 'National income, inflation, and government policies.',
//     },
//     {
//       code: 'ECON102',
//       title: 'Principles of Microeconomics',
//       desc: 'Supply, demand, and market structures.',
//     },
//     {
//       code: 'BUS101',
//       title: 'Business Administration',
//       desc: 'Fundamentals of management, finance, and marketing.',
//     },
//     {
//       code: 'BUS201',
//       title: 'Entrepreneurship',
//       desc: 'Starting and managing a business.',
//     },
//     {
//       code: 'BUS300',
//       title: 'Digital Marketing',
//       desc: 'SEO, social media marketing, and content strategies.',
//     },
//     {
//       code: 'PHIL101',
//       title: 'Introduction to Philosophy',
//       desc: 'Exploring philosophical thought and ethics.',
//     },
//     {
//       code: 'PHIL201',
//       title: 'Logic and Critical Thinking',
//       desc: 'Analyzing arguments and reasoning.',
//     },
//     {
//       code: 'LAW101',
//       title: 'Introduction to Law',
//       desc: 'Legal principles and justice systems.',
//     },
//     {
//       code: 'LAW201',
//       title: 'Business Law',
//       desc: 'Contracts, liability, and corporate regulations.',
//     },
//     {
//       code: 'POL101',
//       title: 'Political Science',
//       desc: 'Governance, policies, and international relations.',
//     },
//     {
//       code: 'GEO101',
//       title: 'Geography and Earth Science',
//       desc: 'Physical and human geography principles.',
//     },
//     {
//       code: 'ENV101',
//       title: 'Environmental Science',
//       desc: 'Study of ecosystems, climate change, and sustainability.',
//     },
//     {
//       code: 'ART101',
//       title: 'Introduction to Art',
//       desc: 'Visual arts, history, and appreciation.',
//     },
//     {
//       code: 'MUS101',
//       title: 'Music Theory',
//       desc: 'Fundamentals of harmony, melody, and rhythm.',
//     },
//     {
//       code: 'MED101',
//       title: 'Introduction to Medicine',
//       desc: 'Basic medical concepts and healthcare principles.',
//     },
//     {
//       code: 'NUR101',
//       title: 'Nursing Fundamentals',
//       desc: 'Essential nursing skills and patient care.',
//     },
//     {
//       code: 'EDU101',
//       title: 'Educational Psychology',
//       desc: 'Learning theories and teaching strategies.',
//     },
//   ];

//   try {
//     const results = await Course.bulkCreate(courses);
//     return results;
//   } catch (error) {
//     logger.error('Error: ', error);
//   }
// }
// async function generateStudents(count: number) {
//   const students = [];

//   try {
//     for (let i = 0; i < count; i++) {
//       const firstName = faker.person.firstName();
//       const lastName = faker.person.lastName();
//       const email = faker.internet.email({
//         firstName,
//         lastName,
//         provider: 'calebuniversity.edu.ng',
//       });
//       const matricNumber = faker.string.numeric({ length: 7 });
//       const level = faker.helpers.arrayElement([100, 200, 300, 400, 500]);
//       const department = faker.helpers.arrayElement(departments);

//       const passwordHash = await bcrypt.hash('password', 10);

//       const user = await User.create({
//         firstName,
//         lastName,
//         email,
//         role: 'student',
//         passwordHash,
//       });
//       const student = await Student.create({
//         id: user.id,
//         level,
//         department,
//         matricNumber,
//       });

//       students.push({
//         id: user.id,
//         firstName,
//         lastName,
//         email,
//         department,
//         level,
//         matricNumber,
//       });
//     }
//     return students;
//   } catch (error) {
//     logger.error(error);
//   }
// }

// async function generateVenues() {
//   const venues = [
//     {
//       latitude: 6.668391494248774,
//       longitude: 3.6363936409367517,
//       name: 'Mass Comm. Auditorium',
//     },
//     {
//       latitude: 6.66876384961853,
//       longitude: 3.636510151680673,
//       name: 'R101',
//     },
//     {
//       latitude: 6.668761018446419,
//       longitude: 3.6365329553443084,
//       name: 'R201',
//     },
//     {
//       latitude: 6.668744031413449,
//       longitude: 3.636427488399994,
//       name: 'R301',
//     },
//     {
//       latitude: 6.6702509815264905,
//       longitude: 3.6358318962882894,
//       name: 'Multipurpose Hall',
//     },
//     {
//       latitude: 6.670072153029815,
//       longitude: 3.637512527536462,
//       name: 'University Auditorium',
//     },
//     {
//       latitude: 6.669935570974693,
//       longitude: 3.637206513145681,
//       name: 'Software Lab',
//     },
//     {
//       latitude: 6.669737430742542,
//       longitude: 3.637359520341071,
//       name: 'E-Library',
//     },
//   ];

//   try {
//     const results = await Venue.bulkCreate(venues);
//     return results;
//   } catch (error) {
//     logger.error(error);
//   }
// }

// export const seedDatabase = async () => {
//   try {
//     await sequelize.sync({ force: true });
//     const students = await generateStudents(5);
//     const teachers = await generateTeachers(5);
//     await generateCourses();
//     await generateVenues();
//   } catch (error) {
//     logger.error(error);
//   }
// };

// seedDatabase();
