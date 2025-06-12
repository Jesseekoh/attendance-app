import { APIError, betterAuth } from 'better-auth';
import { User } from 'better-auth/types';
import { createAuthMiddleware } from 'better-auth/api';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '../config/db';
import { RegisterSchema } from '../schemas';

type AuthReturnType = { user: User; token: any };
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  trustedOrigins: [
    'http://localhost:5173',
    'https://attendance-app-frontend-09ja.onrender.com',
  ],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: false,
    revokeSessionsOnPasswordReset: true,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: true,
      },
    },
  },
  advanced: {
    defaultCookieAttributes: {
      secure: true,
      httpOnly: true,
      sameSite: 'none', // Allows CORS-based cookie sharing across subdomains
      partitioned: true, // New browser standards will mandate this for foreign cookies
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== '/sign-up/email') {
        return;
      }
      if (ctx.body) {
        const isValidRequest = RegisterSchema.safeParse(ctx.body);
        if (isValidRequest.success) {
          const { role, email, matricNumber } = ctx.body;
          const existingEmail = await prisma.user.findFirst({
            where: { email },
          });
          if (existingEmail) {
            throw new APIError('CONFLICT', {
              message: 'User with email already exists',
            });
          }
          if (role === 'student') {
            const existingMatricNumber = await prisma.student.findFirst({
              where: { matricNumber },
            });
            if (existingMatricNumber) {
              throw new APIError('CONFLICT', {
                message: 'Student with matric number already exists',
              });
            }
          }
        }
      }
    }),
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== '/sign-up/email') return;

      const { role, matricNumber, departmentId, level } = ctx.body;
      const returned = ctx.context.returned as AuthReturnType;
      if (returned.user) {
        if (role === 'student') {
          const newStudent = await prisma.student.create({
            data: {
              userId: returned.user?.id,
              departmentId,
              level: Number(level),
              matricNumber,
            },
          });
        }
        if (role === 'teacher') {
          const newTeacher = await prisma.teacher.create({
            data: {
              userId: returned.user.id,
              departmentId,
            },
          });
        }
      }
    }),
  },
});
