import { prisma } from '../config/db';
export interface ITokenPayload {
  id: string;
  role: Role;
}

export type Role = 'student' | 'teacher' | 'admin';
export interface createLectureSessionInput {
  endTime: string;
  startTime: string;
  venueId: string;
  courseId: string;
  teacherId: string;
  departmentId: string;
}
