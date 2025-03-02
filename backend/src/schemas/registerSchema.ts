import { z } from 'zod';
import { Department } from '../models';

const registerSchema = z
    .object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        role: z.enum(['student', 'teacher']),
        password: z.string().min(6),
        matricNumber: z.string().optional(),
        level: z.number().optional(),
        department: z.string(),
    })
    .refine(
        (data) => {
            if (
                data.role === 'student' &&
                !(data.matricNumber && data.level && data.department)
            ) {
                return false;
            }

            return true;
        },
        {
            message:
                'Matric Number, Level and Department is required for students',
            path: ['matricNumber', 'level', 'department'],
        }
    )
    .refine(
        (data) => {
            if (data.role === 'teacher' && !data.department) {
                return false;
            }
            return true;
        },
        { message: 'Department is required for teachers' }
    );

export default registerSchema;
