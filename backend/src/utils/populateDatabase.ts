import { faker, fakerRO } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import {
    sequelize,
    User,
    Teacher,
    Student,
    Class,
    Course,
    Enrollment,
} from '../models';
import { Model } from 'sequelize';

async function generateTeachers(count: number) {
    const teachers = [];

    for (let i = 0; i < count; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({
            firstName,
            lastName,
        });
        const role = 'teacher';
        const password = faker.internet.password();
    }
}

async function generateStudents(count: number) {
    const students = [];

    for (let i = 0; i < count; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({
            firstName,
            lastName,
            provider: 'calebuniversity.edu.ng',
        });
        const matricNumber = faker.string.numeric({ length: 7 });
        const level = faker.helpers.arrayElement([100, 200, 300, 400, 500]);
        const department = faker.commerce.department();
        const password = faker.internet.password();
        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            email,
            role: 'student',
            passwordHash,
        });
        const student = await Student.create({
            id: user.id,
            level,
            department,
            matricNumber,
        });

        students.push({
            id: user.id,
            firstName,
            lastName,
            email,
            password,
            department,
            level,
            matricNumber,
        });
    }
    return students;
}

const createMockData = async () => {
    try {
        await sequelize.sync({ force: true });
        const students = generateStudents(20);
    } catch (error) {
        console.log(error);
    }
};

createMockData();
