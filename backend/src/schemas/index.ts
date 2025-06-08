import { z } from 'zod';

export const ClassSchema = z.object({
  courseId: z.string().length(36),
  venueId: z.string().length(36),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
});

export const RegisterSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    role: z.enum(['student', 'teacher']),
    password: z.string().min(6),
    matricNumber: z
      .string()
      .regex(/^\d{2}\/\d{5}$/, 'Only letters, numbers, and / are allowed'),
    level: z.enum(['100', '200', '300', '400', '500']).optional(),
    departmentId: z.string().uuid(),
  })
  .refine(
    (data) => {
      if (
        data.role === 'student' &&
        !(data.matricNumber && data.level && data.departmentId)
      ) {
        return false;
      }

      return true;
    },
    {
      message: 'Matric Number, Level and Department is required for students',
      path: ['matricNumber', 'level', 'department'],
    }
  )
  .refine(
    (data) => {
      if (data.role === 'teacher' && !data.departmentId) {
        return false;
      }
      return true;
    },
    { message: 'Department is required for teachers' }
  );

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
