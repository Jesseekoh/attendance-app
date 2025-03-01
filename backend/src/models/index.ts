import sequelize from '../config/db';
import User from './User';
import Student from './Student';
import Teacher from './Teacher';
import Course from './Course';
import Class from './Class';
import Enrollment from './Enrollment';
import Department from './Department';

//One-One relationship between Teacher and User
User.hasOne(Teacher, { foreignKey: 'id' });
Teacher.belongsTo(User, { foreignKey: 'id' });

//One-One relationship between User and Student
User.hasOne(Student, { foreignKey: 'id' });
Student.belongsTo(User, { foreignKey: 'id' });

// Many-Many relationship between Teacher and Course
Teacher.belongsToMany(Course, {
    through: 'taught_courses',
});
Course.belongsToMany(Teacher, {
    through: 'taught_courses',
});

// Many-Many relationship between Class and Student
Student.belongsToMany(Class, { through: 'attendance' });
Class.belongsToMany(Student, { through: 'attendance' });

// One-Many relationship between Class and courses
Course.hasMany(Class, { foreignKey: 'courseId', as: 'classes' });
Class.belongsTo(Course, { as: 'course' });

// Many-Many relationship between Student and Course
// one student can enroll in many courses and one course can have many students
Student.belongsToMany(Course, {
    through: {
        model: Enrollment,
        // unique: false,
    },
});
Course.belongsToMany(Student, {
    through: {
        model: Enrollment,
        // unique: false,
    },
});

export {
    sequelize,
    User,
    Teacher,
    Student,
    Class,
    Course,
    Enrollment,
    Department,
};
