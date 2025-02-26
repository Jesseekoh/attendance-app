import Router from 'express';
import Student from '../models/Student';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../utils/helper';

const router = Router();

const saltRounds = 10;

router.post('/register', async (req, res) => {
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
        res.status(200).json({ message: 'User created successfully' });
        return;
    } catch (error: any) {
        console.log('Error: ', error);
        if (error?.name == 'SequelizeUniqueConstraintError') {
            res.status(409).json({ message: 'User already exists' });
            return;
        }

        res.status(500).json({
            message: 'Something went wrong. Please try again later',
        });
        return;
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: 'Email and password required' });
        return;
    }
    try {
        const existingUser = await Student.findOne({ where: { email } });

        if (!existingUser) {
            res.status(404).json({ message: 'User does not exist' });
            return;
        }
        bcrypt.compare(
            password,
            existingUser?.getDataValue('passwordHash'),
            (err, result) => {
                if (result) {
                    const id = existingUser.getDataValue('id').toString('hex');
                    const accessToken = generateAccessToken({ email, id });
                    const refreshToken = generateRefreshToken({ email, id });
                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        secure: true,
                    });
                    res.status(200).json({
                        message: 'Log in successful',
                        data: { accessToken, refreshToken },
                    });
                    return;
                }
                res.status(401).json({ message: 'Wrong email or password' });
            }
        );
    } catch (error: any) {
        res.status(500).json({
            message: 'Something went wrong. Please try again later',
        });
    }
});

router.post('/logout', (req, res) => {
    res.send('Logged out');
});

export default router;
