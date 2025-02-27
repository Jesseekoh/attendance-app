import sequelize from '../config/db';
import User from './User';
import Student from './Student';
import Teacher from './Teacher';
import Course from './Course';

//One-One relationship between Teacher and User
User.hasOne(Teacher);
Teacher.belongsTo(User);

//One-One relationship between User and Student
User.hasOne(Student);
Student.belongsTo(User);

// Many-Many relationship between Teacher and Course
Teacher.belongsToMany(Course, { through: 'taught_courses' });
Course.belongsToMany(Teacher, { through: 'taught_courses' });

// Many-Many relationship between Student and Course
// one student can enroll in many courses and one course can have many students
Student.belongsToMany(Course, { through: 'enrollments' });
Course.belongsToMany(Student, { through: 'enrollments' });
// User.belongsToMany(Course, { through: 'enrollments' });
// Course.belongsToMany(User, { through: 'enrollments' });

export { sequelize, User, Teacher };
