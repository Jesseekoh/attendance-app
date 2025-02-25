import Router from 'express';
import Student from '../models/Student';
import { Error, Model, Op } from 'sequelize';
import bcrypt from 'bcrypt';

const router = Router();

const saltRounds = 10;

router.post('/register', async (req, res): Promise<any> => {
    const { firstName, lastName, email, matricNumber, password } = req.body;
    try {
        let passwordHash = await bcrypt.hash(password, saltRounds);

        console.log(passwordHash);
        const newStudent = await Student.create({
            firstName,
            lastName,
            email,
            passwordHash,
            matricNumber,
        });
        return res.status(200).json({ message: 'User created successfully' });
    } catch (error: any) {
        console.log('Error: ', error);
        if (error?.name == 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'User already exists' });
        }

        return res
            .status(500)
            .json({ message: 'Something went wrong. Please try again later' });
    }
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: 'Email and password required' });
        return;
    }

    res.send('Logged in');
});

router.post('/logout', (req, res) => {
    res.send('Logged out');
});

export default router;
